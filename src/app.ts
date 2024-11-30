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

const app = express();

// load AI onnx model
const modelPath = './model/tetabyte.onnx';
export let session: ort.InferenceSession;

ort.InferenceSession.create(modelPath)
  .then((s) => {
    session = s;
    console.log('ONNX model loaded!');
  })
  .catch((err) => {
    console.error('Failed to load model:', err);
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
app.use('/', viewRouter);
app.use('/users', userRouter);

// Global Error Handling
app.use(catchErrorMiddleware);
export default app;
