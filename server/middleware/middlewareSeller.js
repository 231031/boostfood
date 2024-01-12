import SellerModel from '../model/seller/Seller.model.js'

export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        let exist = await SellerModel.findOne({ username });
        if (!exist) return res.status(401).send({ error : "Username does not exist"});
        console.log('check verify user');
        next();
    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}