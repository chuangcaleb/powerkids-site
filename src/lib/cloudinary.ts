import cloudinary from "cloudinary";

cloudinary.v2.config({
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_SECRET,
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});
const pkCloudinary = cloudinary.v2;

export default pkCloudinary;
