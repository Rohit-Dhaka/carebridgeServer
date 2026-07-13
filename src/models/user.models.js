import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        uniqe:true,
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    phonenumber:{
        type:Number,        
    },
    role:{
        enum:['admin' , 'doctor','patient','receptionist'],
        default:['patient'],        
    },
    profileImage:{
        type:String,
        default:""
    },
    isActive:{
        type:Boolean,
        default:false
    },
    lastLogin:{
        type:Date
    },
    verifed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

// userSchema.pre('save' , async function(){
//     if(this.isModified('password')){
//         return 
//     }     
//     this.password = await bcrypt.hash(this.password , 10);

// }) 

const userModels = mongoose.model("users" , userSchema)
export default userModels;