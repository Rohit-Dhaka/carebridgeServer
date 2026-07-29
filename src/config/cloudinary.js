import {v2 as cloudinary} from 'cloudinary';
import config from './config.js';


cloudinary.config({
     api_key:config.API_KEY,
     cloud_name:config.CLOUD_NAME,
     api_secret : config.API_SECRET,
     secure:true
})
export default cloudinary; 

