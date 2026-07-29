import dotenv from 'dotenv'
dotenv.config();


if(!process.env.PORT){
    throw new Error("PORT is not defined in env file");    
}
if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL is not defined in env file");    
}
if(!process.env.SECRET_KEY){
    throw new Error("SECRET_KEY is not defined in env file");    
}
if(!process.env.EMAIL_USER){
    throw new Error("EMAIL_USER is not defined in env file");    
}
if(!process.env.EMAIL_PASS){
    throw new Error("EMAIL_PASS is not defined in env file");    
}
if(!process.env.CLOUD_NAME){
    throw new Error("CLOUND_NAME is not defined in env file");    
}
if(!process.env.API_KEY){
    throw new Error("API_KEY is not defined in env file");    
}
if(!process.env.API_SECRET){
    throw new Error("API_SECRET is not defined in env file");    
}

const config = {
PORT: process.env.PORT,
MONGO_URL: process.env.MONGO_URL,
SECRET_KEY: process.env.SECRET_KEY,
EMAIL_USER: process.env.EMAIL_USER,
EMAIL_PASS: process.env.EMAIL_PASS,
CLOUD_NAME: process.env.CLOUD_NAME,
API_KEY: process.env.API_KEY,
API_SECRET: process.env.API_SECRET,
}


export default config;