import express from 'express';
import {
  bodyParserMiddleware,
  formParser,
  morganMiddleware,
  cookieParserMiddleware,
  passportInitializationMiddleware,
  corsMiddleware,
} from './middleware/middlewares';
import path from 'path';
import userRouter from './routes/userRoutes';
import viewRouter from './routes/viewRoutes';
import { catchErrorMiddleware } from './middleware/catchError';

const app = express();


// using middlewares
app.use(bodyParserMiddleware);
app.use(formParser);
app.use(morganMiddleware);
app.use(cookieParserMiddleware);
app.use(passportInitializationMiddleware);
app.use(corsMiddleware);

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
