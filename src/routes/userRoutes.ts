import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addRelativeEmail,
} from '../controllers/userControllers';
import {
  isLoggedin,
  login,
  logout,
  protect,
  signup,
} from '../controllers/authControllers';
import { uploadUserImageMiddleware } from '../middleware/middlewares';
import { forgetPassword, resetPassword } from '../controllers/authControllers';
const userRouter = Router();

userRouter.post('/signup', uploadUserImageMiddleware, signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.post('/forget-password', forgetPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/add-relative', protect, isLoggedin, addRelativeEmail);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default userRouter;
