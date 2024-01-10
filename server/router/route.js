import { Router } from 'express';

// import controllers
import * as controller from '../controllers/appController.js';
import * as middleware from '../middleware/middlewareSeller.js';
const router = Router();

// post request
router.route('/register').post(controller.register);
// router.route('/registerMail').post(); // send registration email
router.route('/authenticate').post((req,res) => res.end());
router.route('/login').post(middleware.verifyUser, controller.login);

// get request
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyOTP);
router.route('/createResetSessions').get(controller.createResetSession); // reset all variables

// put request
router.route('/updateuser').put(controller.updateUser);
router.route('/resetPassword').put(controller.resetPassword);


export default router;