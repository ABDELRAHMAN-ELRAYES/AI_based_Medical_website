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

export const renderLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('login', {
      title: 'Login',
    });
  }
);
