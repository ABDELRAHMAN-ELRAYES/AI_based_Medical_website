// import { catchAsync } from '../../utils/catchAsync';
// import { Request, Response, NextFunction } from 'express';
// import { preprocessImage } from '../../utils/preprocessingImage';
// import { session } from '../../app';
// import { getGeminiResponse } from '../../utils/gemini';

// export const predictFromInputImage = catchAsync(
//   async (req: Request, res: Response) => {
//     try {
//       if (!req.file) {
//         return res.status(400).send({ error: 'No file uploaded' });
//       }

//       // preprocess the uploaded image
//       const inputDims = [1, 128, 128, 3];
//       const inputValues = await preprocessImage(req.file.path, inputDims);

//       // perform inference
//       const inputName = session.inputNames[0];
//       const feeds = {
//         [inputName]: { type: 'float32', data: inputValues, dims: inputDims },
//       };
//       const results = await session.run(feeds);

//       // response with the results
//       const outputName = session.outputNames[0];
//       const outputData = results[outputName].data;
//       const prediction = Array.from(outputData)[0];

    
//       const healthStatus = prediction === 0 ? 'Healthy' : 'Tumor Detected';

//       const geminiPrompt =
//       healthStatus === 'Healthy'
//         ? 'Provide advice on how to stay healthy and avoid tumors.'
//         : 'Provide guidance on what to do if a tumor is detected in the body.';

//     const geminiResponse = await getGeminiResponse(geminiPrompt);
  
      
//       res.render('Report', {
//         uploadedImagePath: req.file.path,
//         prediction,
//         healthStatus,
//         advice: geminiResponse,
//       });
  
//     } catch (error) {
//       console.error('Error during inference:', error);
//       res.status(500).send({ error: 'Failed to process the image' });
//     }
//   }
// );
