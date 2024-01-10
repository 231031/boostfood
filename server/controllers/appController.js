import SellerModel from '../model/seller/Seller.model.js'
import bcrypt, { hash } from 'bcrypt';
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
                console.log(username);
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
                return res.status(500).send({ error: error.message })
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
    res.status(201).json('Get User Request');
}


export async function generateOTP(req, res) {
    
}

export async function verifyOTP(req, res) {
    res.status(201).json('Verify OTP Request');
}

// successfully redirect user when OTP is valid
export async function createResetSession(req, res) {
    
}

// put request
export async function updateUser(req, res) {
    
}

export async function resetPassword(req, res) {
    
}



