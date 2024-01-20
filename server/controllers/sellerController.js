import SellerModel from '../model/seller/Seller.model.js'
import FoodModel from '../model/seller/Food.model.js'
import IngredientModel from '../model/seller/Ingredient.model.js';
            
// already verify username

export async function getFood(req, res) {
    const { username } = req.params || req.query;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        FoodModel.find({ username })
        .then((food) => {
            console.log(food);
            return res.status(200).send(food);
        })
        .catch((error) => {
            return res.status(500).send({ error: error.message });
        });
        
    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}

export async function getIngredient(req, res) {
    const { username } = req.params || req.query;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        IngredientModel.find({ username })
        .then((ingredient) => {
            return res.status(200).send(ingredient);
        })
        .catch((error) => {
            return res.status(500).send({ error });
        });
        
    } catch (error) {
        return res.status(404).send({ error });
    }
}

export async function getProduct(req, res) {
    const { username } = req.user;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        const foodList = await FoodModel.find({ username });
        const ingredientList = await IngredientModel.find({ username });


        return res.status(200).send({foodList, ingredientList});


    } catch (error) {
        console.log(error);
        return res.status(404).send({ error });
    }
}


export async function addFood(req,res) {
    const { username } = req.user;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        const { foodname, price, discountedPrice, category, stock, pic } = req.body;
        console.log(req.body);

            const food = new FoodModel({
                username,
                foodname,
                price,
                discountedPrice,
                category,
                stock,
                pic,
            });

            food.save() // return promise
            .then(result => res.status(201).send({ msg: "Created Food Successfully"}))
            .catch(error => res.status(500).send({error}));

    } catch (error) {
        return res.status(404).send({ error });
    }
}

export async function addIngredient(req,res) {
    const { username } = req.user;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        const { ingredientname, price, discountedPrice, category, stock, pic } = req.body;
            
            const ingredient = new IngredientModel({
                username,
                ingredientname,
                price,
                discountedPrice,
                category,
                stock,
                pic,
            });

            ingredient.save() // return promise
            .then(result => res.status(201).send({ msg: "Created Ingredient Successfully"}))
            .catch(error => res.status(500).send({error}));

    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }
}

export async function updateLocation(req, res) {
    const { username } = req.user;
    try {
        if (!username) return res.status(501).send({ error : "Invalid username" });
        const { longitude, latitude } = req.body;
        console.log(username, longitude, latitude);

        SellerModel.updateOne({ username : username },{ 
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



            