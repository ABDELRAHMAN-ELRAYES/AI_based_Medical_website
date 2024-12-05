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
  protect,
  signup,
} from '../controllers/authControllers';
import { uploadUserImageMiddleware } from '../middleware/middlewares';
const userRouter = Router();

userRouter.post('/signup', uploadUserImageMiddleware,signup);
userRouter.post('/login', login);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default userRouter;
