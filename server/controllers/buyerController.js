import BuyerModel from '../model/buyer/Buyer.model.js'
import bcrypt, { hash } from 'bcrypt';
import ENV from '../config.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';

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