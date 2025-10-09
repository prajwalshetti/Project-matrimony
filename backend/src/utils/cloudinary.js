import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        console.log("Uploading file to Cloudinary:", localFilePath);
        console.log("Cloudinary config:", {
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY ? "Set" : "Not Set",
            api_secret: process.env.CLOUDINARY_SECRET ? "Set" : "Not Set"
        });
        
        // Uploading the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);
        console.log("File uploaded successfully:", response.url);
        return response;
        
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        console.error("Full error:", error);
        
        // Delete local file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};