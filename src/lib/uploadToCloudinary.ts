import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const uploadOnCloudinary = async (localFilePath:string) => {
  try {
    
      if (!localFilePath) return;
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: 'auto'
      });
      return response.secure_url;
  } catch (error) {
      fs.unlinkSync(localFilePath); 
      return null;
  }
};


export { uploadOnCloudinary }