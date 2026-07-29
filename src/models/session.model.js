import mongoose from 'mongoose'


const sessionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    refreshTokenHash:{
        type:String,
        required:[true,"refresh token is required"]
    },
    ip:{
        type:String,
        required:[true,'ip address is required']
    },
    userAgent:{
        type:String,
        required:[true,"user agent is requried"]
    },
    revoked:{
        type:Boolean,
        default:false
    }
},{timeseries:true,})

const sessionModel = mongoose.model('sessions' , sessionSchema)
export default sessionModel;