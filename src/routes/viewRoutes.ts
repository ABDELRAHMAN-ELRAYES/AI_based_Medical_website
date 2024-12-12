import { Router } from 'express';
import {
  renderView,
  renderUserReport,
  renderUserProfile,
  renderResetPasswordForm,
} from '../controllers/viewControllers';
import {
  protect,
  isLoggedin,
  isOnSession,
} from '../controllers/authControllers';
import {
  predictBreastCancer,
  predictChestDiseaseFromInputImage,
  predictFromInputImage,
  predictHeartDisease,
} from '../controllers/modelControllers/modelController';
import { uploadInputImageFromUserToBePredicted } from '../middleware/middlewares';
const viewRouter = Router();

viewRouter.route('/login').get(renderView('login', 'Login'));
viewRouter.route('/signup').get(renderView('signup', 'Singup'));
viewRouter
  .route('/forget-password')
  .get(renderView('forgetPasswordPage', 'Forget Password'));
viewRouter.get('/reset-password/:token', renderResetPasswordForm);

viewRouter.route('/').get(isOnSession, renderView('home', 'Home'));
// viewRouter.use(protect, isLoggedin);
viewRouter.route('/home').get(protect, isLoggedin, renderView('home', 'Home'));
viewRouter
  .route('/brain-tumor')
  .get(protect, isLoggedin, renderView('model1', 'Brain Tumor'));
viewRouter
  .route('/chest-x-ray')
  .get(protect, isLoggedin, renderView('model2', 'Chest X Ray'));
viewRouter
  .route('/breast-cancer')
  .get(protect, isLoggedin, renderView('model3', 'Breast Cancer'));
viewRouter
  .route('/heart-disease')
  .get(protect, isLoggedin, renderView('model4', 'Heart Disease'));

// viewRouter.route('/profile').get(protect, isLoggedin,renderView('profile', 'Profile'));

viewRouter.route('/profile').get(protect, isLoggedin,renderUserProfile);
viewRouter.get('/report', protect, isLoggedin, renderView('report', 'Report'));
viewRouter.get('/:predictionId/report', protect, isLoggedin, renderUserReport);

viewRouter
  .route('/predict-brain-tumor')
  .post(
    protect,
    isLoggedin,
    uploadInputImageFromUserToBePredicted,
    predictFromInputImage
  );

viewRouter
  .route('/predict-chest-x-ray')
  .post(
    protect,
    isLoggedin,
    uploadInputImageFromUserToBePredicted,
    predictChestDiseaseFromInputImage
  );

viewRouter
  .route('/predict-breast-cancer')
  .post(protect, isLoggedin, predictBreastCancer);
viewRouter
  .route('/predict-heart-disease')
  .post(protect, isLoggedin, predictHeartDisease);

export default viewRouter;
