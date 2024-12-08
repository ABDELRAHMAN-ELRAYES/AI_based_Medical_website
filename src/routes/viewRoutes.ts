import { Router } from 'express';
import {
  renderLogin,
  renderHome,
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
  predictChestDiseaseFromInputImage,
  predictFromInputImage,
} from '../controllers/modelControllers/modelController';
import { uploadInputImageFromUserToBePredicted } from '../middleware/middlewares';
const viewRouter = Router();

viewRouter.route('/login').get(renderView('login', 'Login'));
viewRouter.route('/signup').get(renderView('signup', 'Singup'));

viewRouter.route('/').get(isOnSession, renderHome);
viewRouter.use(protect, isLoggedin);
viewRouter.route('/home').get(renderHome);
viewRouter.route('/brain-tumor').get(renderView('model1', 'Brain Tumor'));
viewRouter.route('/heart-disease').get(renderView('model2', 'Heart Disease'));
viewRouter.route('/model3').get(renderView('model3', 'model3'));
viewRouter.route('/model4').get(renderView('model4', 'model4'));

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
export default viewRouter;
