import { Router } from 'express';
import {
  renderView,
  renderUserReport,
  renderUserProfile,
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

viewRouter.route('/').get(isOnSession, renderView('home', 'Home'));
viewRouter.use(protect, isLoggedin);
viewRouter.route('/home').get(renderView('home', 'Home'));
viewRouter.route('/brain-tumor').get(renderView('model1', 'Brain Tumor'));
viewRouter.route('/chest-x-ray').get(renderView('model2', 'Chest X Ray'));
viewRouter.route('/breast-cancer').get(renderView('model3', 'Breast Cancer'));
viewRouter.route('/heart-disease').get(renderView('model4', 'Heart Disease'));

// viewRouter.route('/profile').get(renderView('profile', 'Profile'));

viewRouter.route('/profile').get(renderUserProfile);
viewRouter.get('/report', renderView('report', 'Report'));
viewRouter.get('/:predictionId/report', renderUserReport);

viewRouter
  .route('/predict-brain-tumor')
  .post(uploadInputImageFromUserToBePredicted, predictFromInputImage);

viewRouter
  .route('/predict-chest-x-ray')
  .post(
    uploadInputImageFromUserToBePredicted,
    predictChestDiseaseFromInputImage
  );

viewRouter.route('/predict-breast-cancer').post(predictBreastCancer);
viewRouter.route('/predict-heart-disease').post(predictHeartDisease);

export default viewRouter;
