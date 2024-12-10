import { catchAsync } from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { preprocessImage } from '../../utils/preprocessingImage';
import {
  brainTumorSession,
  breastCancerSession,
  chestXRaySession,
} from '../../app';
import { getGeminiResponse } from '../../utils/gemini';
import { PrismaClient } from '@prisma/client';
import { ErrorHandler } from '../../utils/ErrorHandler';
import * as ort from 'onnxruntime-node';

import {
  BreastCancerFeatures,
  featureNames,
} from '../../interface/IBreastCancerModel';

const prisma = new PrismaClient();

export const predictFromInputImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }

      // preprocess the uploaded image
      const inputDims = [1, 128, 128, 3];
      const inputValues = await preprocessImage(req.file.path, inputDims);

      // perform inference
      const inputName = brainTumorSession.inputNames[0];
      const feeds = {
        [inputName]: { type: 'float32', data: inputValues, dims: inputDims },
      };
      const results = await brainTumorSession.run(feeds);

      // response with the results
      const outputName = brainTumorSession.outputNames[0];
      const outputData = results[outputName].data;

      const predictionResult = Array.from(outputData)[0];
      const currentUserId = req.user?.id as string;

      // get a response from gemini based on the provided prediction result
      const healthStatus =
        predictionResult <= 0.5 ? 'Healthy' : 'Tumor Detected';

      const geminiPrompt =
        healthStatus === 'Healthy'
          ? 'Provide advice on how to stay healthy and avoid tumors.'
          : 'Provide guidance on what to do if a tumor is detected in the body.';

      const geminiResponse = await getGeminiResponse(geminiPrompt);

      // store the prediciton result to database
      const data = {
        modelName: req.body.modelName,
        userId: currentUserId,
        result: healthStatus,
        resultInNumbers: predictionResult.toString(),
        tips: geminiResponse,
        diseaseImg: req.file?.filename as string,
      };

      const prediction = await prisma.prediction.create({ data });

      res.status(200).redirect(`/${prediction.id}/report`);

      // res.json({ prediction: predictionResult, response: geminiResponse ,data});
    } catch (error) {
      return next(new ErrorHandler(500, 'Failed to process the image'));
    }
  }
);

export const predictChestDiseaseFromInputImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }

      // preprocess the uploaded image
      const inputDims = [1, 128, 128, 3];
      const inputValues = await preprocessImage(req.file.path, inputDims);

      // perform inference
      const inputName = chestXRaySession.inputNames[0];
      const feeds = {
        [inputName]: { type: 'float32', data: inputValues, dims: inputDims },
      };
      const results = await chestXRaySession.run(feeds);

      // response with the results
      const outputName = chestXRaySession.outputNames[0];
      const outputData = results[outputName].data;

      const predictionResult = Array.from(outputData)[0];
      const currentUserId = req.user?.id as string;

      // get a response from gemini based on the provided prediction result
      const healthStatus =
        predictionResult <= 0.5 ? 'Healthy' : 'Chest X Ray Disease';

      const geminiPrompt =
        healthStatus === 'Healthy'
          ? 'Provide advice on how to stay healthy and avoid chest disease'
          : 'Provide guidance on what to do if a chest disease is detected in the body.';

      const geminiResponse = await getGeminiResponse(geminiPrompt);

      // store the prediciton result to database
      const data = {
        modelName: req.body.modelName,
        userId: currentUserId,
        result: healthStatus,
        resultInNumbers: predictionResult.toString(),
        tips: geminiResponse,
        diseaseImg: req.file?.filename as string,
      };

      const prediction = await prisma.prediction.create({ data });

      res.status(200).redirect(`/${prediction.id}/report`);

      // res.json({ prediction: predictionResult, response: geminiResponse ,data});
    } catch (error) {
      return next(new ErrorHandler(500, 'Failed to process the image'));
    }
  }
);
const breast_cancer_example_data: BreastCancerFeatures = {
  radius_mean: 17.99,
  texture_mean: 10.38,
  perimeter_mean: 122.8,
  area_mean: 1001.0,
  smoothness_mean: 0.1184,
  compactness_mean: 0.2776,
  concavity_mean: 0.3001,
  'concave points_mean': 0.1471,
  symmetry_mean: 0.2419,
  fractal_dimension_mean: 0.07871,
  radius_se: 1.095,
  texture_se: 0.9053,
  perimeter_se: 8.589,
  area_se: 153.4,
  smoothness_se: 0.006399,
  compactness_se: 0.04904,
  concavity_se: 0.05373,
  'concave points_se': 0.01587,
  symmetry_se: 0.033,
  fractal_dimension_se: 0.006193,
  radius_worst: 25.38,
  texture_worst: 17.33,
  perimeter_worst: 184.6,
  area_worst: 2019.0,
  smoothness_worst: 0.1622,
  compactness_worst: 0.6656,
  concavity_worst: 0.7119,
  'concave points_worst': 0.2654,
  symmetry_worst: 0.4601,
  fractal_dimension_worst: 0.1189,
};

export const predictBreastCancer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if there are any missing needed input feattures
      const missingFeatures = featureNames.filter(
        (feature) => !(feature in breast_cancer_example_data)
      );
      if (missingFeatures.length > 0) {
        throw new Error(`Missing features: ${missingFeatures.join(', ')}`);
      }

      // prepare input data
      const inputArray = new Float32Array(
        featureNames.map((name) => breast_cancer_example_data[name])
      );

      // construct the input tensor
      const inputTensor: ort.Tensor = {
        data: inputArray,
        dims: [1, featureNames.length],
        type: 'float32',
      };
      // run inference
      const feeds: Record<string, ort.Tensor> = {
        [breastCancerSession.inputNames[0]]: inputTensor,
      };
      const results = await breastCancerSession.run(feeds);

      // Get prediction result
      const probabilities = results[breastCancerSession.outputNames[0]]
        .data as Float32Array;
      const predictedClass = probabilities.indexOf(Math.max(...probabilities));

      const currentUserId = req.user?.id as string;

      // get a response from gemini based on the provided prediction result
      const healthStatus = predictedClass !== 1 ? 'Healthy' : 'Infected';

      const geminiPrompt =
        healthStatus === 'Healthy'
          ? 'Provide advice on how to stay healthy and avoid Breast Cancer'
          : 'Provide guidance on what to do if a Breast Cancer is detected in the body.';

      const geminiResponse = await getGeminiResponse(geminiPrompt);

      res.status(200).json({
        probabilities,
        healthStatus,
        geminiResponse,
      });
      // res.json({ prediction: predictionResult, response: geminiResponse ,data});
    } catch (error) {
      return next(new ErrorHandler(500, 'Failed to process the image'));
    }
  }
);
