import dotenv from 'dotenv';
import cloudinaryM from 'cloudinary';

dotenv.config();

const cloudinary = cloudinaryM.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
