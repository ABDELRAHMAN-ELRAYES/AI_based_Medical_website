import { catchAsync } from '../../utils/catchAsync';
import { Request, Response, NextFunction, response } from 'express';
import { preprocessImage } from '../../utils/preprocessingImage';
import { brainTurmoSession ,chestXRaySession} from '../../app';
import { getGeminiResponse } from '../../utils/gemini';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const predictFromInputImage = catchAsync(
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }

      // preprocess the uploaded image
      const inputDims = [1, 128, 128, 3];
      const inputValues = await preprocessImage(req.file.path, inputDims);

      // perform inference
      const inputName = brainTurmoSession.inputNames[0];
      const feeds = {
        [inputName]: { type: 'float32', data: inputValues, dims: inputDims },
      };
      const results = await brainTurmoSession.run(feeds);

      // response with the results
      const outputName = brainTurmoSession.outputNames[0];
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
        diseaseImg:req.file?.filename as string,
      };

      const prediction = await prisma.prediction.create({ data });
      
      res.status(200).redirect(`/${prediction.id}/report`);

      // res.json({ prediction: predictionResult, response: geminiResponse ,data});
    } catch (error) {
      console.error('Error during inference:', error);
      res.status(500).send({ error: 'Failed to process the image' });
    }
  }
);

export const predictChestDiseaseFromInputImage = catchAsync(
  async (req: Request, res: Response) => {
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
        diseaseImg:req.file?.filename as string,
      };

      const prediction = await prisma.prediction.create({ data });
      
      res.status(200).redirect(`/${prediction.id}/report`);

      // res.json({ prediction: predictionResult, response: geminiResponse ,data});
    } catch (error) {
      console.error('Error during inference:', error);
      res.status(500).send({ error: 'Failed to process the image' });
    }
  }
);
