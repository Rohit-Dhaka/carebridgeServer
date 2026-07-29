import nodemailer from 'nodemailer'
import config from '../config/config.js'


const transport = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user: config.EMAIL_USER,
        pass:config.EMAIL_PASS
    }
})

const sendEmail = async (email, subject,html)=>{
    await transport.sendMail({
        from:config.EMAIL_USER,
        to:email,
        subject,
        html
    })
}
export default sendEmail