import { Router } from 'express';

import * as mailer from '../controllers/mailer.js';
import * as buyerController from '../controllers/buyerController.js';
import * as middleware from '../middleware/middleware.js';
import * as controller from '../controllers/appController.js';

import Auth, { localVariables } from '../middleware/auth.js';
const routerBuyer = Router();

// get request
routerBuyer.route('/user/:username').get(buyerController.getBuyer);
routerBuyer.route('/generateOTP').get(middleware.verifyBuyer, localVariables, controller.generateOTP);
routerBuyer.route('/verifyOTP').get(middleware.verifyBuyer, controller.verifyOTP);
routerBuyer.route('/createResetSessions').get(controller.createResetSession); // reset all variables

// post request
routerBuyer.route('/register').post(buyerController.register);
routerBuyer.route('/login').post(middleware.verifyBuyer, buyerController.login);
routerBuyer.route('/registerMail').post(mailer.sendMail); // send registration email
routerBuyer.route('/getnearlocation/:username').post(Auth, buyerController.getNearLocation); // get near location

// put request
routerBuyer.route('/resetPassword').put(middleware.verifyBuyer, buyerController.resetPasswordBuyer);
routerBuyer.route('/updatelocation/:username').put(Auth, buyerController.updateLocation);



export default routerBuyer;