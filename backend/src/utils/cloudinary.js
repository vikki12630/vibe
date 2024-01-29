import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //nodejs file system

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: [
        { width: 700, height: 850 },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const avatarUploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: [
        { width: 320, height: 320 },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteOnCloudinary = async(publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {invalidate: true})
    console.log("deleted on coudinary")
  } catch (error) {
    console.log(error)
  }
}

export { uploadOnCloudinary, deleteOnCloudinary, avatarUploadOnCloudinary };
