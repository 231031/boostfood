import bcrypt, { hash } from 'bcrypt';
import ENV from '../config.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';

import BuyerModel from '../model/buyer/Buyer.model.js'
import SellerModel from '../model/seller/Seller.model.js'
import FoodModel from '../model/seller/Food.model.js'
import IngredientModel from '../model/seller/Ingredient.model.js';


export async function register(req, res) {
    try {
        const { firstName, lastName, email, tel, username, password } = req.body;

        const existUsername =  new Promise((resolve, reject) => {
            BuyerModel.findOne({ username })       
            .then((user) => {
                console.log(user);
                if (user) reject({ error : "Please provide a unique username" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })                                                                    
        })
    
        const existEmail =  new Promise((resolve, reject) => {
            BuyerModel.findOne({ email })
            .then((email) => {
                if (email) reject({ error : "Please provide a unique email" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })
        })
    
        const existTel =  new Promise((resolve, reject) => {
            BuyerModel.findOne({ tel })
            .then((tel) => {
                if (tel) reject({ error : "Please provide a unique telephone number" });
                resolve();
            }).catch((err) => {
                if (err) reject(new Error(err));
            })
        })

        Promise.all([existUsername, existEmail, existTel])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10) // return promise
                        .then(hashed => {
                            const buyer = new BuyerModel({
                                firstName,
                                lastName,
                                email,
                                tel,
                                username,
                                password : hashed,
                            });

                            // return save result as a response
                            buyer.save() // return promise
                                .then(result => res.status(201).send({ msg: "User registered successfully"}))
                                .catch(error => res.status(500).send({error}));                        
                        })
                        .catch(error => {
                        return res.status(500).send({
                            error : "Enable to hash password"
                        })
                    })
                }
            }).catch (error => {
                console.log(error);
                return res.status(500).send({ error });
            })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error });
    }
    

}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
       BuyerModel.findOne({ username })
       .then((user) => {
           console.log(user);
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
               return res.status(400).send({ error });
           })
       })
       .catch((error) => {
           return res.status(404).send({ error });
       })

    } catch (error) {
       return res.status(400).send({ error });
    }
}

export async function getBuyer(req, res) {
    const { username } = req.params;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        BuyerModel.findOne({ username })
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

export async function resetPasswordBuyer(req,res) {
    try {
        // resetSession has expired
        if (req.app.locals.resetSession && req.app.locals.resetSession.expirationTime < Date.now()) {
            req.app.locals.resetSession.value = false;
            return res.status(440).send({ error : "Session Expired" });
        }
    
        const { username, password } = req.body;
        try {
            BuyerModel.findOne({ username })
            .then((user) => { 
                bcrypt.hash(password, 10)
                .then(hashed => {
                    req.app.locals.resetSession.value = false;
                    BuyerModel.updateOne({ username : user.username }, { password : hashed })
                    .then((data) => {
                        return res.status(201).send({ msg : "Password Updated" });
                    })
                    .catch((error) => {
                        return res.status(error.statusCode).send({ error });
                    });
                })
                .catch((error) => {
                    return res.status(500).send({ error });
                });
            })
            .catch((error) => {
                return res.status(404).send({ error });
            })
        } catch (error) {
            return res.status(500).send({ error });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}

// TODO: 
export async function updateLocation(req, res) {
    const { username } = req.user;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        const { longitude, latitude } = req.body;
        console.log(username, longitude, latitude);

        BuyerModel.updateOne({ username : username },{ 
            $set: { location: {
                type: 'Point',
                coordinates: [longitude, latitude], 
            }}}
        )
        .then((data) => {
            console.log(data);
            return res.status(201).send({ msg: 'Location updated successfully'});
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).send({ error: error.message });
        });

    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }
}

export async function getNearLocation(req, res) {
    try {
        const { longitude, latitude } = req.body;
        const radius = 3;
        const center = [longitude, latitude];

        SellerModel.find({
            location: {
              $geoWithin: {
                $centerSphere: [center, radius / 6371] // Earth's radius is approximately 6371 km
              }
            }
          })
          .then((data) => {
            return res.status(201).send(data);
          })
          .catch((error) => {
            console.log(error);
            return res.status(404).send(error);
          });

    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }

}