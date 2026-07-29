import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    otpHash:{
        type:String,
        required:[true,"otp is required"]
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    user:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
       type: {
      type: String,
      enum: ["verify-email", "forgot-password"],      
    },
    expiresAt: {
      type: Date,
      
    },
    isVerified :{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const otpModel = mongoose.model('otps' , otpSchema)
export default otpModel;