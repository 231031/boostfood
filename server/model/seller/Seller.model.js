import mongoose from 'mongoose';

export const SellerSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Please provide  unique username"],
        unique : [true, "Username Exist"]
    },
    password : {
        type : String,
        required : [true, "Please provide  a password"],
        unique : false,
    },
    email : {
        type : String,
        required : [true, "Please provide a unique email address"],
        unique : true,
    },
    firstName : {
        type : String,
        required : [true, "Please provide a first name"],
    },
    lastName : {
        type : String,
        required : [true, "Please provide a last name"],
    },
    tel : {
        type : Number,
        required : [true, "Please provide a unique telephone number"],
        unique : [true, "Telephone Exist"],
    },
    store : {
        type : String,
        required : [true, "Please provide a unique store name"],
        unique : [true, "Store Name Exist"],
    }
});

export default mongoose.model.Sellers || mongoose.model('Seller', SellerSchema);