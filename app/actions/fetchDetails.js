"use server"
import mongoose from "mongoose";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
import Image from "@/models/Image";
import SharedImage from "@/models/SharedImage";

//fetch user datails for the given email
export async function fetchUser(useremail) {
    await connectDB();
    console.log("Fetching user:", useremail);
    
    // Find the user
    const user = await User.findOne({email: useremail});
    
    // Check if user exists before accessing properties
    if (!user) {
        return null;
    }
    
    // Convert the user document to a plain JavaScript object
    const userObj = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
    
    // Now you can safely access the ID
    return userObj._id.toString();
}

export const fetchUploads = async (userId) => {
    await connectDB();
    console.log("Fetching uploads for user:", userId);
    try {
        const images = await Image.find({ user: userId })
            .sort({ uploadDate: -1 })
            .lean(); // Convert Mongoose documents to plain objects

        return images.map(image => ({
            ...image,
            _id: image._id.toString(), // Convert ObjectId to string
            user: image.user.toString(), // Convert ObjectId to string if needed
            uploadDate: image.uploadDate.toISOString() // Convert Date to string
        }));
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};


//fetch image details for the given imageId
export const fetchImageDetails = async (imageId) => {
    await connectDB();
    console.log("Fetching image details for ID:", imageId);
    try {
        const image = await Image.findById(imageId).lean(); // Convert Mongoose document to plain object

        if (!image) {
            console.error("Image not found with ID:", imageId);
            return null;
        }

        return {
            ...image,
            _id: image._id.toString(), // Convert ObjectId to string
            user: image.user.toString(), // Convert ObjectId to string if needed
            iv: image.iv.toString(), // Convert ObjectId to string if needed
            fileName: image.fileName.toString(), // Convert ObjectId to string if needed
            uploadDate: image.uploadDate.toISOString(), // Convert Date to string
            uploadDate: image.uploadDate.toISOString() // Convert Date to string
        };
    } catch (error) {
        console.error("Error fetching image details:", error);
        return null;
    }
}


//fetch Received Images from SharedImages

export const fetchReceivedImage = async (userId) => {
    await connectDB();
    console.log("Fetching received images for user:", userId);
    try {
        const images = await SharedImage.find({ receiver: userId })
            .sort({ sharedAt: -1 })
            .lean(); // Convert Mongoose documents to plain objects

        return images.map(image => ({
            ...image,
            _id: image._id.toString(),
            sender: image.sender.toString(),
            receiver: image.receiver.toString(),
            imageId: image.imageId.toString(),
            hash: image.hash, // Already a string in your schema
            iv: image.iv, // Already a string in your schema
            sharedAt: image.sharedAt.toISOString()
        }));
    } catch (error) {
        console.error("Error fetching received images:", error);
        return [];
    }
};


    export const fetchPersonalDetails = async (userEmail) => {
        try {
            await connectDB();
            console.log("Fetching user details for email:", userEmail);
            
            // Explicitly select the fields you want to retrieve
            const user = await User.findOne(
                { email: userEmail },
                'email qualification bio location updatedAt' // Explicitly select fields
            ).lean();
            
            if (!user) {
                console.error("User not found with email:", userEmail);
                return null;
            }
            
            console.log("Found user data:", user); // Debug log to see what's coming from DB
            console.log("Qualification value:", user.Qualification); // Add this specific log

            // Transform the user object
            return {
                ...user,
                _id: user._id.toString(),
                updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
                // Ensure these specific fields are included (with defaults if they're missing)
                qualification: user.Qualification || "",
                bio: user.bio || "",
                location: user.location || ""
            };
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    };

    export const fetchRole = async (userEmail) => {
        try {
            await connectDB();
            console.log("Fetching role for email:", userEmail);
    
            // Only fetch role field
            const user = await User.findOne(
                { email: userEmail },
                'role' // ✅ only select role
            ).lean();
    
            if (!user) {
                console.error("User not found with email:", userEmail);
                return null;
            }
    
            console.log("Role:", user.role);
    
            return { role: user.role }; // ✅ return only role
        } catch (error) {
            console.error("Error fetching user role:", error);
            throw error;
        }
    };
    