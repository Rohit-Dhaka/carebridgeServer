import { Router } from "express";
import * as authController from '../controllers/auth.Controller.js'
import authMiddlewares from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/uplode.middlewares.js";
const authRouter = Router()



authRouter.post('/register', authController.register)
authRouter.post('/verify', authController.verified)
authRouter.post('/login', authController.login)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/logout', authController.logout)
authRouter.post('/logout-all', authController.logoutAll)

authRouter.post('/forgot-password', authController.forgotPassword)
authRouter.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOTP)
authRouter.post('/reset-password', authController.resetPassword)
authRouter.patch('/change-password', authController.changePassword)

authRouter.get('/get-me',  authMiddlewares , authController.getUser)
authRouter.patch('/profile-update',  authMiddlewares ,  authController.updateProfile)

authRouter.patch('/avatar', authMiddlewares ,  upload.single('avatar') , authController.uploadAvatar)
authRouter.delete('/avatar', authMiddlewares,   authController.deleteAvatar)

authRouter.delete('/account', authMiddlewares , authController.deleteAccount)
authRouter.patch('/account/deactivate', authMiddlewares, authController.deactivateAccount)
authRouter.patch('/account/reactivate', authMiddlewares , authController.reactivateAccount)
// authRouter.patch('/account/reactivate', authMiddlewares , authController.reactivateAccount)


export default authRouter