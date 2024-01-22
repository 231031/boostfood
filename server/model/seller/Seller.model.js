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
    },
    location : {
        type: {
            type: String,
            enum: ['Point'], // ประเภทต้องเป็น "Point"
            required: false
          },
          coordinates: {
            type: [Number], // เก็บพิกัดเป็น [longitude, latitude]
            index: '2dsphere' // สร้างดัชนีสำหรับการค้นหาใน 2D Sphere
          }
    },
    review: [
        {
            reviewer : {
                type: mongoose.Schema.Types.ObjectId
            },
            starts: Number,
            commentAt : {
                type: Date,
                required: true
            }
        }
    ],
    avgRating : {
        type: Object,
        default: 0
    }
}, {
    timestamps : true,
});

export default mongoose.model.Sellers || mongoose.model('Seller', SellerSchema);