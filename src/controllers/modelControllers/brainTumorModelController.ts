import { catchAsync } from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { preprocessImage } from '../../utils/preprocessingImage';
import { brainTumorSession } from '../../app';
import { getGeminiResponse } from '../../utils/gemini';
import { PrismaClient } from '@prisma/client';
import { ErrorHandler } from '../../utils/ErrorHandler';
import * as ort from 'onnxruntime-node';
import { sendEmailBasedOnPredictionResult } from '../../utils/sendEmailFromPrediction';

const prisma = new PrismaClient();

export const brainTumorModelController = catchAsync(
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

      const user = await prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
      });
      // sending email for the relative if the patient test was not health
      const modelName = (req.body.modelName as string).replace(
        'Specialist',
        ''
      );
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

      const geminiPrompt =
        healthStatus === 'Healthy'
          ? 'Provide advice on how to stay healthy and avoid tumors.'
          : 'Provide guidance on what to do if a tumor is detected in the body.';

      const geminiResponse = await getGeminiResponse(geminiPrompt);

      // store the prediciton result to database
      const data = {
        modelName,
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
