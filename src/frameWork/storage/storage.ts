import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { config } from "../config/envConfig";

if (!config.CLOUD_NAME || !config.CLOUD_APIKEYS || !config.CLOUD_PASSWORD) {
  console.error("Cloudinary configuration is incomplete");
  throw new Error("Cloudinary configuration is missing required credentials");
}

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_APIKEYS,
  api_secret: config.CLOUD_PASSWORD,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const allowedFormats = ["jpg", "png", "jpeg"];
    const extension = file.mimetype.split("/")[1];
    if (!allowedFormats.includes(extension)) {
      throw new Error("Invalid file format");
    }
    return {
      folder: "blog_images",
      format: extension,
      // transformation: [
      //   {
      //     quality: "auto",
      //     fetch_format: "auto",
      //     crop: "limit",
      //   },
      // ],
      public_id: `${Date.now()}_${file.originalname}`, // Ensure unique public_id
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
