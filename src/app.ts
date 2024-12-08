import express from 'express';
import {
  bodyParserMiddleware,
  formParser,
  morganMiddleware,
  cookieParserMiddleware,
  passportInitializationMiddleware,
} from './middleware/middlewares';
import path from 'path';
import userRouter from './routes/userRoutes';
import viewRouter from './routes/viewRoutes';
import { catchErrorMiddleware } from './middleware/catchError';
import * as ort from 'onnxruntime-node';
import googleRouter from './routes/googleRoutes';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { renderNotFoundErrorPage } from './utils/ErrorHandler';


const app = express();

// integrate with gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//! load AI Brain Tumor onnx model
const brainTumorModelPath = process.env.BRAIN_TUMOR_MODEL_PATH as string;
export let brainTurmoSession: ort.InferenceSession;

ort.InferenceSession.create(brainTumorModelPath)
  .then((s) => {
    brainTurmoSession = s;
    console.log('Brain Tumor ONNX model loaded!');
  })
  .catch((err) => {
    console.error('Failed to load Brain Tumor model:', err);
  });

//! load AI Chest X Ray onnx model
const chestXRayModelPath = process.env.CHEST_X_RAY_MODEL_PATH as string;
export let chestXRaySession: ort.InferenceSession;

ort.InferenceSession.create(chestXRayModelPath)
  .then((s) => {
    chestXRaySession = s;
    console.log('Chest X Ray ONNX model loaded!');
  })
  .catch((err) => {
    console.error('Failed to load Chest X Ray model:', err);
  });

// using middlewares
app.use(bodyParserMiddleware);
app.use(formParser);
app.use(morganMiddleware);
app.use(cookieParserMiddleware);
app.use(passportInitializationMiddleware);

// define the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// define public  static files
app.use(express.static(path.join(__dirname, 'public')));

// mounting routers
app.use('/auth/google', googleRouter);
app.use('/users', userRouter);
app.use('/', viewRouter);
app.use('*', renderNotFoundErrorPage);

// Global Error Handling
app.use(catchErrorMiddleware);
export default app;
