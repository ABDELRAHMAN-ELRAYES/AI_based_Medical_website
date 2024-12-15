import * as ort from 'onnxruntime-node';
import { strokePredictionSession } from '../../app';
import {
  strokePredictionFeatureNames,
  stroke_prediction_sample_input,
} from '../../interface/IStrokePredictionModel';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { getGeminiResponse } from '../../utils/gemini';
import { sendEmailBasedOnPredictionResult } from '../../utils/sendEmailFromPrediction';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// stroke prediction sample data
const stroke_prediction_sample_input = {
  gender: 1,
  age: 67.0,
  hypertension: 0,
  heart_disease: 1,
  ever_married: 1,
  work_type: 0,
  avg_glucose_level: 228.69,
  bmi: 36.6,
  smoking_status: 2,
};

export const strokePredictionModelController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const enteredUserData = req.body;
    // check if there are any missing needed input feattures
    const missingFeatures = strokePredictionFeatureNames.filter(
      (feature) => !(feature in enteredUserData)
    );

    if (missingFeatures.length > 0) {
      throw new Error(`Missing features: ${missingFeatures.join(', ')}`);
    }

    // prepare input data
    const inputArray = new Float32Array(
      strokePredictionFeatureNames.map(
        (name) => enteredUserData[name] + 0.0
      )
    );
    // construct the input as tensor
    const inputTensor: ort.Tensor = {
      type: 'float32',
      data: inputArray,
      dims: [1, strokePredictionFeatureNames.length],
    };

    // run inference
    const feeds: Record<string, ort.Tensor> = {
      [strokePredictionSession.inputNames[0]]: inputTensor,
    };

    const results = await strokePredictionSession.run(feeds);

    // get prediction result
    const probabilities = results[strokePredictionSession.outputNames[0]]
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
        ? 'Provide advice on how to stay healthy and avoid Heart Stoke occurance'
        : 'Provide guidance on what to do if a  Heart Stoke is detected to be accured.';

    const geminiResponse = await getGeminiResponse(geminiPrompt);

    res.status(200).json({
      probabilities,
      healthStatus,
      geminiResponse,
    });
  }
);
