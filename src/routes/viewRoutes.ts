import { Router } from 'express';
import {
  renderLogin,
  renderHome,
  renderView,
} from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
import { predictFromInputImage } from '../controllers/modelControllers/modelController';
import { uploadInputImageFromUserToBePredicted } from '../middleware/middlewares';
const viewRouter = Router();

// viewRouter.route('/home').get(protect, isLoggedin, renderHome);

viewRouter.route('/login').get(renderView('login', 'Login'));
viewRouter.route('/signup').get(renderView('signup', 'Singup'));

viewRouter.route('/').get(renderHome);
viewRouter
  .route('/predict')
  .post(uploadInputImageFromUserToBePredicted, predictFromInputImage);
viewRouter.use(protect, isLoggedin);
viewRouter.route('/').get(renderHome);
viewRouter.route('/home').get(renderHome);
viewRouter.route('/brain-tumor').get(renderView('model1', 'Brain Tumor'));
viewRouter.route('/heart-disease').get(renderView('model2', 'Heart Disease'));
viewRouter.route('/model3').get(renderView('model3', 'model3'));
viewRouter.route('/model4').get(renderView('model4', 'model4'));

viewRouter.route('/profile').get(renderView('profile', 'Profile'));

export default viewRouter;
