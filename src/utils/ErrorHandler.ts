import { Request, Response, NextFunction } from 'express';
import { IError } from '../interface/IError';
import { catchAsync } from './catchAsync';

export class ErrorHandler implements IError {
  status: string;
  statusCode: number;
  message: string;
  name: string = 'Error';
  constructor(statusCode: number, message: string) {
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    Error.captureStackTrace(this, this.constructor);
  }
}
export const renderNotFoundErrorPage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(404).render('error' ,{title:'Error 404'});
  }
);
