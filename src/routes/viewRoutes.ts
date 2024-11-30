import { Router } from 'express';
import { renderLogin, renderHome } from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
import { predictFromInputImage } from '../controllers/modelControllers/modelController';
import { uploadInputImageFromUserToBePredicted } from '../middleware/middlewares';
const viewRouter = Router();

// viewRouter.route('/').get(protect, isLoggedin, renderHome);
// viewRouter.route('/home').get(protect, isLoggedin, renderHome);
viewRouter.route('/').get(renderHome);
viewRouter
  .route('/predict')
  .post(uploadInputImageFromUserToBePredicted, predictFromInputImage);
viewRouter.route('/home').get(renderHome);
viewRouter.route('/login').get(isOnSession, renderLogin);
export default viewRouter;
