import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { hash, compare } from '../utils/SecurityUtils';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();
    res.status(200).json({
      users,
    });
  }
);
export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      user,
    });
  }
);
export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // hashing password before storing it in DataBase
    const data = req.body;
    const user = await prisma.user.createMany({
      data,
    });
    res.status(201).json({
      user,
    });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.status(200).json({
      user,
    });
  }
);
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).json({
      user,
    });
  }
);
// adding a relative email for current user
export const addRelativeEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const relativeEmail = req.body.email;
    // update the user with relative email
    const user = await prisma.user.update({
      where: {
        id: req.user?.id as string,
      },
      data: {
        relativeEmail:relativeEmail,
      },
    });

    res.status(200).redirect('/home#models');
  }
);
