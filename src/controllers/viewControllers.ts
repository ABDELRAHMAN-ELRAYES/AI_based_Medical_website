import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
import { breast_cancer_example_data } from '../controllers/modelControllers/breastCancerModelController';
const prisma = new PrismaClient();

export const renderView = (viewName: string, title: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render(viewName, {
      title,
      breast_cancer_example_data
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

    const modelName = predictionResult?.modelName.endsWith('Specialist')
      ? (predictionResult?.modelName as string)
      : (predictionResult?.modelName as string) + 'Specialist';
      
    console.log(modelName);
    const doctors = await prisma.user.findMany({
      where: {
        title: modelName,
      },
    });
    res.status(200).render('report', {
      title: 'Report',
      prediction: predictionResult,
      doctors,
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
