import userModel from "../models/user.model.js";
import sendEmail from "../services/email.service.js";
import { getForgotPasswordOtpHtml, getOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs/promises'

export async function register(req, res) {
    try {
        const {name,email,password}= req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All field are required"})
        }
        const isExists = await userModel.findOne({email})
        if(isExists){
            return res.status(400).json({message:"User already exists"})
        }
        const user = await userModel.create({name,email,password})
        const otp = getOtp();
        const html = getOtpHtml(otp);
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
        await sendEmail(email, `Your verification code is ${otp}` , html)
        await otpModel.create({otpHash,email,user:user.id , expiresAt: new Date(Date.now() + 10 * 60 * 1000) , type:'verify-email'})
        return res.status(200).json({ message: "User registered successfully",user })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function verified(req, res) {
    try {
        const {email,otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({message:"All field are required"})
        }
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
        const otpRecord = await otpModel.findOne({email,otpHash});
        if(!otpRecord){
            return res.status(400).json({message:"otp record is not find"})
        }
        
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not find"})
        }
        user.verified = true,
        await user.save();
        await otpModel.deleteOne(otpRecord._id)
        return res.status(200).json({ message: "Email verified successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function login(req, res) {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All field are required"})
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"Email not velied"})
        }
        if(!user.verified){
            return res.status(400).json({message:"User not verified"})
        }
        const isPassword = password === user.password;
        if(!isPassword){
            return res.status(400).json({message:"Password not match"})
        }
     
        const refreshToken = jwt.sign(
            {id:user.id},
            config.SECRET_KEY,
            {expiresIn:'7d'}
        )
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
       const session =  await sessionModel.create({
            refreshTokenHash,
            ip:req.ip, 
            user:user.id,
            userAgent: req.headers[ 'user-agent' ]
        })
        
           const accessToken = jwt.sign(
            {id:user._id,
                sessionId:session._id
            },
            config.SECRET_KEY,
            {expiresIn:'1d'}
        )

   res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
        return res.status(200).json({ message: "User logged in successfully",user,accessToken })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken        
        if(!refreshToken){
            return res.status(400).json({message:"refresh token not found"})
        }        
        const decode = jwt.verify(refreshToken , config.SECRET_KEY)
        
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

        const session = await sessionModel.findOne({refreshTokenHash , revoked:false})
        if(!session){
            return res.status(400).json({message:"session not found"})
        }
        const accessToken = jwt.sign(
            {id:decode.id},
            config.SECRET_KEY,
            {expiresIn:'15m'}            
        )
            const newRefreshToken = jwt.sign(
            {id:decode.id},
            config.SECRET_KEY,
            {expiresIn:'7d'}            
        )
        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
        session.refreshTokenHash = newRefreshTokenHash
        await session.save();

        res.cookie('refreshToken' , newRefreshToken , {
            httpOnly:true,
            sameSite:true,
            secure:true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        

        return res.status(200).json({ message: "Access token refreshed successfully" , accessToken })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({message:"refreshToken not found"})
        }
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
        console.log(refreshTokenHash)        
        const session = await sessionModel.findOne({refreshTokenHash , revoked:false});
        console.log(session)
        session.revoked = true
        await session.save();
        res.cleareCookie('refreshToken')
        return res.status(200).json({ message: "User logged out successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function logoutAll(req, res) {
    try {
        const refreshToken  = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(400).json({message:"refresh token not found"})
        }
        const decoded = jwt.verify(refreshToken , config.SECRET_KEY)
                   
        await sessionModel.updateMany({user:decoded.id , revoked:false},{revoked:true})
        res.cleareCookie('refreshToken')
        return res.status(200).json({ message: "Logged out from all devices successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function forgotPassword(req, res) {
    try {
          console.log("req.body",req.body);
        const {email} = req.body;
        console.log("Backend email" , email)
        if(!email){
            return res.status(400).json({message:"Email not find"})
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not find"})
        }
        const otp = getOtp()
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
        await otpModel.create({otpHash , email,user:user.id , type:'forgot-password',expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
        const html  = getForgotPasswordOtpHtml(otp);
        await sendEmail(email , `Your Reset Password OTP ${otp}` , html)
        return res.status(200).json({ message: "Password reset OTP sent successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}


export async function verifyForgotPasswordOTP(req, res) {
    try {
        const {email, otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({message:"All filed are required"})
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
        const otpDate = await otpModel.findOne({email,otpHash , type:"forgot-password"})
        if(!otpDate){
            return res.status(400).json({message:"otp data is not find"})
        }
        if(otpDate.expiresAt  < new Date()){
            await otpModel.deleteOne({_id:otpDate._id})
            return res.status(400).json({message:"OTP is expired"})
        }

        otpDate.isVerified = true;
        await otpDate.save();
        return res.status(200).json({ message: "Password reset successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
export async function resetPassword(req, res) {
    try {
         const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = await otpModel.findOne({
      email,
      type: "forgot-password",
      isVerified: true,
    });

    if (!otp) {
      return res.status(400).json({
        message: "OTP not verified",
      });
    }

    user.password = newPassword
    await user.save();

    // Revoke all sessions
    await sessionModel.updateMany(
      { user: user._id },
      { revoked: true }
    );

    // Delete OTP
    await otpModel.deleteOne({ _id: otp._id });

    return res.status(200).json({
      message: "Password reset successfully",
    });
        
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}


export async function changePassword(req, res) {
    try {
        const {currentPassword, newPassword , confirmNewPassword}  = req.body;
        const token = req.headers.authorization?.split(" ")[1]
          if(!currentPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({message:"All filed are required"})
        }
        if(!token){
            return res.status(400).json({message:"Token not found"})
        }
        const decoded = jwt.verify(token , config.SECRET_KEY)
        const user = await userModel.findById(decoded.id)
      
        const comparePassword = user.password === currentPassword 
        if(!comparePassword){
            return res.status(400).json({message:"current password not match"})
        }
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message:"new or confirm password not match"})
        }
        user.password = newPassword 
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" , user })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}


export async function getUser(req, res) {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({message:"user not find"})
        }

        return res.status(200).json({ message: "User profile fetched successfully" ,user})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" , error: error.message })
        
    }
}

export async function updateProfile(req, res) {
    try {
        const user = req.user;
        const {name,bio,phone}  = req.body;      
        if(!user){
            return res.status(400).json({message:"user not find"});            
        }
        if(name !== undefined) user.name = name;
        user.bio = bio;
        user.phone = phone;
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully",user })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function uploadAvatar(req, res) {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({message:"User not find"})
        }
        if(!req.file){
            return res.status(400).json({message:"please upload the image"})
        }
        const result = await cloudinary.uploader.upload(req.file.path)
        console.log("image url" , result.secure_url)
        await fs.unlink(req.file.path)
        user.avatar = result.secure_url;
        await user.save();
        return res.status(200).json({ message: "Avatar uploaded successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function deleteAvatar(req, res) {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({message:"user is not difned"})
        }
        user.avatar = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
        await user.save();
        return res.status(200).json({ message: "Avatar deleted successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function deleteAccount(req, res) {
    try {
        const user = req.user; 
        if(!user){
            return  res.status(400).json({message:"User not find"})
        }        
        await userModel.findByIdAndDelete(user._id)
        return res.status(200).json({ message: "Account deleted successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function deactivateAccount(req, res) {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({message:"user not find"})
        }
        user.status = 'inactive'
        await user.save();
        return res.status(200).json({ message: "Account deactivated successfully" ,user})
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function reactivateAccount(req, res) {
    try {
           const user = req.user;
        if(!user){
            return res.status(400).json({message:"user not find"})
        }
        user.status = 'active'
        await user.save();
        return res.status(200).json({ message: "Account reactivated successfully" , user })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}
