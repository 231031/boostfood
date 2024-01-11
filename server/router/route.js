import { Router } from 'express';

// import controllers
import * as controller from '../controllers/appController.js';
import * as mailer from '../controllers/mailer.js';

// import middlewares
import * as middleware from '../middleware/middlewareSeller.js';
import Auth, { localVariables } from '../middleware/auth.js';
const router = Router();

// post request
router.route('/register').post(controller.register);
router.route('/registerMail').post(mailer.sendMail); // send registration email
router.route('/authenticate').post(middleware.verifyUser, (req,res) => res.end());
router.route('/login').post(middleware.verifyUser, controller.login);

// get request
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(middleware.verifyUser, localVariables, controller.generateOTP);
router.route('/verifyOTP').get(middleware.verifyUser, controller.verifyOTP);
router.route('/createResetSessions').get(controller.createResetSession); // reset all variables

// put request
router.route('/updateuser').put(Auth, controller.updateUser);

// create reset session check before redirect to this path
router.route('/resetPassword').put(middleware.verifyUser, controller.resetPassword);


export default router;