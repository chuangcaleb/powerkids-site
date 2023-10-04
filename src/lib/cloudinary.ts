import cloudinary from "cloudinary";

export interface CldImage {
  url: string;
  height: number;
  width: number;
  alt?: string;
}

cloudinary.v2.config({
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_SECRET,
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});
const pkCloudinary = cloudinary.v2;

export async function getImageByPublicId(id: string): Promise<CldImage> {
  try {
    return await pkCloudinary.api.resource(id);
  } catch (error) {
    console.error(error);
    return { url: "", height: 0, width: 0, alt: "" };
  }
}

export default pkCloudinary;
