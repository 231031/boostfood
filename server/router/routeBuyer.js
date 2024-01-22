import { Router } from 'express';

import * as mailer from '../controllers/mailer.js';
import * as buyerController from '../controllers/buyerController.js';
import * as middleware from '../middleware/middleware.js';
import * as controller from '../controllers/appController.js';

import Auth, { localVariables } from '../middleware/auth.js';
const routerBuyer = Router();

// get request
routerBuyer.route('/generateOTP').get(middleware.verifyBuyer, localVariables, controller.generateOTP);
routerBuyer.route('/verifyOTP').get(middleware.verifyBuyer, controller.verifyOTP);

// post request
routerBuyer.route('/register').post(buyerController.register);
routerBuyer.route('/login').post(buyerController.login);
routerBuyer.route('/registerMail').post(mailer.sendMail); // send registration email




export default routerBuyer;