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
  checkIfHaveRelativeEmail,
} from '../controllers/authControllers';
import { heartDiseaseModelController } from '../controllers/modelControllers/heartDiseaseModelController';
import { brainTumorModelController } from '../controllers/modelControllers/brainTumorModelController';
import { chestXRayModelController } from '../controllers/modelControllers/chestXRayModelController';
import { breastCancerModelController } from '../controllers/modelControllers/breastCancerModelController';
import { strokePredictionModelController } from '../controllers/modelControllers/strokePredictionController';

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
  .get(
    protect,
    isLoggedin,
    checkIfHaveRelativeEmail,
    renderView('model1', 'Brain Tumor')
  );
viewRouter
  .route('/chest-x-ray')
  .get(
    protect,
    isLoggedin,
    checkIfHaveRelativeEmail,
    renderView('model2', 'Chest X Ray')
  );
viewRouter
  .route('/breast-cancer')
  .get(
    protect,
    isLoggedin,
    checkIfHaveRelativeEmail,
    renderView('model3', 'Breast Cancer')
  );
viewRouter
  .route('/heart-disease')
  .get(
    protect,
    isLoggedin,
    checkIfHaveRelativeEmail,
    renderView('model4', 'Heart Disease')
  );
  viewRouter
  .route('/stroke-occurance')
  .get(
    protect,
    isLoggedin,
    checkIfHaveRelativeEmail,
    renderView('model5', 'Stroke Occurance')
  );
// viewRouter.route('/profile').get(protect, isLoggedin,renderView('profile', 'Profile'));

viewRouter.route('/profile').get(protect, isLoggedin, renderUserProfile);
viewRouter.get('/report', protect, isLoggedin, renderView('report', 'Report'));
viewRouter.get('/:predictionId/report', protect, isLoggedin, renderUserReport);

viewRouter
  .route('/predict-brain-tumor')
  .post(
    protect,
    isLoggedin,
    uploadInputImageFromUserToBePredicted,
    brainTumorModelController
  );

viewRouter
  .route('/predict-chest-x-ray')
  .post(
    protect,
    isLoggedin,
    uploadInputImageFromUserToBePredicted,
    chestXRayModelController
  );

viewRouter
  .route('/predict-breast-cancer')
  .post(protect, isLoggedin, breastCancerModelController);

viewRouter
  .route('/predict-heart-disease')
  .post(protect, isLoggedin, heartDiseaseModelController);

viewRouter
  .route('/predict-stroke-accurance')
  .post(protect, isLoggedin, strokePredictionModelController);

export default viewRouter;
