import userModels from "../models/user.models.js";



export async function register(req,res){
    try{
        return res.status(200).json({message:"User register successfully"})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}