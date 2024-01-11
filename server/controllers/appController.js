import SellerModel from '../model/seller/Seller.model.js'
import bcrypt, { hash } from 'bcrypt';
import ENV from '../config.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
/*
{
  "username" : "hello",
  "password" : "12345",
  "email" : "exam@gmail.com",
  "store" : "kfc",
  "firstName" : "p",
  "lastName" : "pipo",
  "tel" : "0210001110"
}
*/

// post request
export async function register(req, res) {
    try {
        
        const { firstName, lastName, email, tel, store, username, password } = req.body;

        // check exist information
        const existUsername =  new Promise((resolve, reject) => {
            SellerModel.findOne({ username })       
            .then((username) => {
                if (username) reject({ error : "Please provide a unique username" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })                                                                    
        })

        const existEmail =  new Promise((resolve, reject) => {
            SellerModel.findOne({ email })
            .then((email) => {
                if (email) reject({ error : "Please provide a unique email" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })
        })

        const existStore =  new Promise((resolve, reject) => {
            SellerModel.findOne({ store })
            .then((store) => {
                if (store) reject({ error : "Please provide a unique store" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })
        })

        const existTel =  new Promise((resolve, reject) => {
            SellerModel.findOne({ tel })
            .then((tel) => {
                if (tel) reject({ error : "Please provide a unique telephone number" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })
        })

        // accept array of promises and run in parallel
        Promise.all([existUsername, existEmail, existStore, existTel])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10) // return promise
                        .then(hashed => {
                            const seller = new SellerModel({
                                firstName,
                                lastName,
                                email,
                                tel,
                                store,
                                username,
                                password : hashed,
                            });

                            // return save result as a response
                            seller.save() // return promise
                                .then(result => res.status(201).send({ msg: "Seller registered successfully"}))
                                .catch(error => res.status(500).send({error}));                        
                        })
                        .catch(error => {
                        return res.status(500).send({
                            error : "Enable to hash password"
                        })
                    })
                }
            }).catch (error => {
                return res.status(500).send({ error });
            })
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

export async function login(req, res) {
    const { username, password } = req.body;
     try {
        SellerModel.findOne({ username })
        .then((user) => {
            
            bcrypt.compare(password, user.password)
            .then(match => {
                if (!match) return res.status(400).send({ error : "invalid password!"});

                // create jwt token
                const token = jwt.sign({
                    userId : user._id,
                    username : user.username,
                }, ENV.JWT_SECRET, { expiresIn : "24h"});

                return res.status(200).send({
                    msg : "Login successful",
                    username : user.username,
                    token,
                })
            })
            .catch((error) => {
                return res.status(400).send({ error: error.message });
            })
        })
        .catch((error) => {
            return res.status(404).send({ error : error.message });
        })

     } catch (err) {

     }
}



// get request
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        SellerModel.findOne({ username })
        .then((user) => {
            if(!user) return res.status(501).send({ error : "User not found" });

            // remove password from object 
            // mongoose return data with object convert into json
            const { password, ...rest } = Object.assign({}, user.toJSON());
            return res.status(201).send(rest);

        }).catch((error) => {
            return res.status(500).send({ error : error.message });
        })
    } catch (error) {
        return res.status(404).send({ error: error.message });    
    }
}


export async function generateOTP(req, res) {
    req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    res.status(201).send({ code : req.app.locals.OTP });
}

// use request query
export async function verifyOTP(req, res) {
    const { code } = req.query;

    // code is OTP from user input
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg : "Verify Success" });
    }
    return res.status(400).send({ error : "Invalid OTP" });
}

// successfully redirect to reset password user when OTP is valid
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(201).send({ msg : "access" });
    }
    return res.status(440).send({ error : "Session Expired" });
}



// put request
export async function updateUser(req, res) {
    try {

        // get id from req property that get from token
        // const id = req.user.userId;
        const { userId } = req.user;
        
        if (userId) {
            const body = req.body;

            SellerModel.updateOne({_id: userId}, body)
            .then((user) => {
                return res.status(201).send({ msg: 'User updated successfully'});
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).send({ error: error.message });
            });
        } else {
            res.status(500).send({ msg : "Not Found id" });
        }
    } catch (error) {
        return res.status(401).send({ error : error.message });
    }
}

export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error : "Session Expired" });
    
        const { username, password } = req.body;
        try {
            SellerModel.findOne({ username })
            .then((user) => { 
                bcrypt.hash(password, 10)
                .then(hashed => {
                    req.app.locals.resetSession = false;
                    SellerModel.updateOne({ username : user.username }, { password : hashed })
                    .then((data) => {
                        return res.status(201).send({ msg : "Password Updated" });
                    })
                    .catch((error) => {
                        return res.status(error.statusCode).send({ error : error.message });
                    });
                })
                .catch((error) => {
                    return res.status(500).send({ error : error.message });
                });
            })
            .catch((error) => {
                return res.status(404).send({ error : error.message });
            })
        } catch (error) {
            return res.status(500).send({ error : error.message });
        }
    } catch (error) {
        return res.status(401).send({ error : error.message });
    }
}



