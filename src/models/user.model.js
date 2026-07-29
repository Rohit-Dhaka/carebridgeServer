import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlenght:8
    },
    role:{
        type:String,
        enum: ["doctor", "patient", "receptionist"],
        default:'receptionist'
    },
    phone:{
        type:String,

    },
    status:{
        type:String,
        enum:['active','inactive','blocked'],
        default:'active'
    },
    avatar:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAkluRDQc6zWNeZmuBW6JX3JXg3hGpBwesaRLGKsWlA&s=10'
    },
    bio:{
        type:String,
        default:"Healthcare Made Simple Today"
    },
    verified:{
        type:Boolean,
        default:false
    },
    isPhoneVerified:{
        type:Boolean,
        default:false,
    },
    lastLogin:{
        type:Date,
    }
})

const userModel = mongoose.model("users" , userSchema)
export default userModel;