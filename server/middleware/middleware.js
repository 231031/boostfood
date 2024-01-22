import SellerModel from '../model/seller/Seller.model.js'
import BuyerModel from '../model/buyer/Buyer.model.js';

export async function verifyUser(req, res, next) {
    try {
        let { username } = req.method == "GET" ? req.query : req.body;
        if (!username) username = req.params.username || req.query.username;
        console.log(username);
        let exist = await SellerModel.findOne({ username });
        if (!exist) return res.status(401).send({ error : "Username does not exist"});
        console.log('check verify user');
        next();
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error : error.message });
    }
}

export async function verifyBuyer(req, res, next) {
    try {
        let { username } = req.method == "GET" ? req.query : req.body;
        if (!username) username = req.params.username || req.query.username;
        console.log(username);
        let exist = await BuyerModel.findOne({ username });
        if (!exist) return res.status(401).send({ error : "Username does not exist"});
        console.log('check verify user');
        next();
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error : error.message });
    }
}