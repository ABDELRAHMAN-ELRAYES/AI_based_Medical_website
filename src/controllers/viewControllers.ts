import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export const renderView = (viewName: string, title: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render(viewName, {
      title,
    });
  });
};
export const renderUserReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const predictionId = req.params.predictionId as string;
    const predictionResult = await prisma.prediction.findFirst({
      where: {
        id: predictionId,
      },
      include: {
        user: true,
      },
    });
    const doctors = await prisma.user.findMany({
      where: {
        title: predictionResult?.modelName as string,
      },
    });
    res.status(200).render('report', {
      title: 'Report',
      prediction: predictionResult,
      doctors
    });
  }
);
export const renderUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const predictions = await prisma.prediction.findMany({
      where: {
        userId: req.user?.id as string,
      },
    });
    res.status(200).render('profile', {
      title: 'Profile',
      predictions,
    });
  }
);
export const renderResetPasswordForm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.params.token as string).slice(1);
    
    res.render('resetPassword', {
      title: 'Send Password',
      token,
    });
  }
);
