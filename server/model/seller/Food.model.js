import mongoose from 'mongoose';

export const FoodSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : false,
    },
    foodname : {
        type : String,
        required : [true, "Please provide  food name"],
        unique : false,
    },
    price : {
        type : Number,
        required : [true, "Please provide  a price food"],
        unique : false,
    },
    discountedPrice : {
        type : Number,
        required : [true, "Please provide a discounted price"],
        unique : false,
    },
    category : {
        type: String,
        require: [true, "Please provide a category"],
    },
    stock : {
        type: Number,
        require: [true, "Please provide stock"]
    },
    sold : {
        type: Number,
        default: 0,
    },
    pic : {
        type: String,
        required : false,
        unique : false,
    }
}, {
    timestamps : true,
});

export default mongoose.model.Foods || mongoose.model('Food', FoodSchema);