import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


// Function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'avatars',
      });
      return result.secure_url;
    } catch (err) {
      throw new Error(`Error uploading avatar: ${err.message}`);
    }
  };


// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({ storage: storage });

export { upload, uploadToCloudinary };

