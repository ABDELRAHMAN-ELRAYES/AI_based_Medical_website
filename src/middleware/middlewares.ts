import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from './googleOauth';
import cors from 'cors';
import { uploadImage } from './uploadImages';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';

export const helmetMiddleware = helmet();
export const limiterMiddleware = rateLimit({
  windowMs:15*60*1000,
  max:100
})
export const csrfMiddleware = csrf({cookie:true})
export const morganMiddleware = morgan('dev');
export const bodyParserMiddleware = express.json();
export const formParser = express.urlencoded({ extended: true });
export const cookieParserMiddleware = cookieParser();
export const passportInitializationMiddleware = passport.initialize();
export const uploadUserImageMiddleware = uploadImage(
  'doctors-verification',
  'idVerification'
);
export const uploadInputImageFromUserToBePredicted = uploadImage(
  'predict-users-images',
  'image'
);
