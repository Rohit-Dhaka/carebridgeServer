import userModel from '../models/user.model.js'

import config from '../config/config.js'
import jwt from 'jsonwebtoken'



const authMiddlewares = async ( req ,res , next)=>{
    try{
        const token =  req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(400).json({message:"token not find"})
        }
        const decode = jwt.verify(token, config.SECRET_KEY)
        const user = await userModel.findById(decode.id)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        req.user = user;
        next();        
    }
    catch(error){
        return res.status(500).json({error:"Internal server error"})
    }

}
export default authMiddlewares;