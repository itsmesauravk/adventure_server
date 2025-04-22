const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Cloudinary config not found");
  process.exit(1);
}

const uploadFile = async (file, folder) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: `/Going Nepal Adventure/${folder}`,
      options: { resource_type: "auto" },
    });

    if (!uploadResult) {
      throw new Error("Error uploading file");
    }

    return uploadResult;
  } catch (error) {
    console.log("Error on cloudinary:", error);
  }
};

// Upload video
const uploadVideo = async (file, folder) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: `/Going Nepal Adventure/${folder}`,
      resource_type: "video",
    });
    if (!uploadResult) {
      throw new Error("Error uploading file");
    }
    return uploadResult;
  } catch (error) {
    console.log("Error on cloudinary:", error);
  }
};

const deleteImage = async (secureUrl) => {
  try {
    if (!secureUrl) {
      throw new Error("secureUrl is required");
    }

    const publicId = secureUrl
      .split("/")
      .slice(7) // Remove initial URL components
      .join("/") // Join remaining components
      .replace(/\.[^/.]+$/, ""); // Remove the file extension

    const updatedString = publicId.replace(/%20/g, " ");

    const result = await cloudinary.uploader.destroy(updatedString);

    if (result.result !== "ok") {
      throw new Error("Error deleting file");
    }

  } catch (error) {
    console.error("Error in deleteImage function:", error);
    throw error;
  }
};

module.exports = { uploadFile, uploadVideo, deleteImage };
