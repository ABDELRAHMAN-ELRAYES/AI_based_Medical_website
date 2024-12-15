import { catchAsync } from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import {
  heartDiseaseSession,
} from '../../app';
import { getGeminiResponse } from '../../utils/gemini';
import { PrismaClient } from '@prisma/client';
import * as ort from 'onnxruntime-node';
import {
  heartDiseaseFeatureNames,
  IHeartDiseaseFeatures,
} from '../../interface/IHeartDiseaseModel';
import { sendEmailBasedOnPredictionResult } from '../../utils/sendEmailFromPrediction';

const prisma = new PrismaClient();
const heart_disease_example_data: IHeartDiseaseFeatures = {
  Age: 45,
  Sex: 1,
  ChestPainType: 3,
  RestingBP: 120,
  Cholesterol: 250,
  FastingBS: 0,
  RestingECG: 0,
  MaxHR: 150,
  ExerciseAngina: 0,
  Oldpeak: 1.5,
  ST_Slope: 2,
  NumMajorVessels: 0,
  Thal: 3,
};

export const heartDiseaseModelController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if there are any missing needed input feattures
    const missingFeatures = heartDiseaseFeatureNames.filter(
      (feature) => !(feature in heart_disease_example_data)
    );
    if (missingFeatures.length > 0) {
      throw new Error(`Missing features: ${missingFeatures.join(', ')}`);
    }

    // prepare input data
    const inputArray = new Float32Array(
      heartDiseaseFeatureNames.map(
        (name) => heart_disease_example_data[name] + 0.0
      )
    );

    // construct the input as tensor
    const inputTensor: ort.Tensor = {
      type: 'float32',
      data: inputArray,
      dims: [1, heartDiseaseFeatureNames.length],
    };

    // run inference
    const feeds: Record<string, ort.Tensor> = {
      [heartDiseaseSession.inputNames[0]]: inputTensor,
    };

    const results = await heartDiseaseSession.run(feeds);

    // get prediction result
    const probabilities = results[heartDiseaseSession.outputNames[0]]
      .data as any;
    const predictedClass = probabilities.indexOf(Math.max(...probabilities));

    const currentUserId = req.user?.id as string;

    const healthStatus = predictedClass !== 1 ? 'Healthy' : 'Infected';
    // sending email for the relative if the patient test was not health
    const modelName = (req.body.modelName as string).replace('Specialist', '');
    const user = await prisma.user.findFirst({
      where: {
        id: currentUserId,
      },
    });
    const userRelativeEmail = user?.relativeEmail as string;
    const predictionDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const userFullName = user?.name as string;

    if (healthStatus !== 'Healthy') {
      await sendEmailBasedOnPredictionResult(
        modelName,
        userRelativeEmail,
        userFullName,
        predictionDate as string
      )(req, res, next);
    }

    // get a response from gemini based on the provided prediction result
    const geminiPrompt =
      healthStatus === 'Healthy'
        ? 'Provide advice on how to stay healthy and avoid Heart Disease'
        : 'Provide guidance on what to do if a Heart Disease is detected in the body.';

    const geminiResponse = await getGeminiResponse(geminiPrompt);

    res.status(200).json({
      probabilities,
      healthStatus,
      geminiResponse,
    });
  }
);