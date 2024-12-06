import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userControllers';
import {
  isLoggedin,
  login,
  logout,
  protect,
  signup,
} from '../controllers/authControllers';
import { uploadUserImageMiddleware } from '../middleware/middlewares';
const userRouter = Router();

userRouter.post('/signup', uploadUserImageMiddleware, signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default userRouter;
