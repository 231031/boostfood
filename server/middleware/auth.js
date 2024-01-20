import jwt from 'jsonwebtoken';
import ENV from '../config.js';

export default async function Auth(req, res, next) {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];
        
        // retrieve user details
        const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        next();

    } catch (error) {
        res.status(401).send({ error : error.message });
    }
}

export function localVariables(req, res, next) {

    // These variables can be accessed throughout the entire application
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next();
}