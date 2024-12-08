import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export const renderHome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('home', {
      title: 'Home',
    });
  }
);

export const renderView = (viewName: string, title: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render(viewName, {
      title,
    });
  });
};

export const renderLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('login', {
      title: 'Login',
    });
  }
);
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
    res.status(200).render('report', {
      title: 'Report',
      prediction: predictionResult,
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
