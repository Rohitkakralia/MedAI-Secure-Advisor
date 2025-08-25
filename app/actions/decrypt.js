"use server"
import mongoose from "mongoose";
import connectDB from "@/db/connectDb";
import Image from "@/models/Image";
import SharedImage from "@/models/SharedImage";

// Function to fetch hash from database using image ID
export const fetchHash = async (imageId) => {
    await connectDB();
    console.log("Fetching hash for image ID:", imageId);
    
    try {
        if (!imageId) {
            console.error("No image ID provided");
            return null;
        }

        const image = await Image.findById(imageId).lean();

        if (!image) {
            console.error("Image not found with ID:", imageId);
            return null;
        }

        return image.hash;
    } catch (error) {
        console.error("Error fetching hash:", error);
        return null;
    }
};

// Function to fetch IV from database using image ID
export const fetchIv = async (imageId) => {
    await connectDB();
    console.log("Fetching IV for image ID:", imageId);
    
    try {
        if (!imageId) {
            console.error("No image ID provided");
            return null;
        }

        const image = await Image.findById(imageId).lean();

        if (!image) {
            console.error("Image not found with ID:", imageId);
            return null;
        }

        return image.iv;
    } catch (error) {
        console.error("Error fetching IV:", error);
        return null;
    }
};

// Function to fetch both hash and IV from database using image ID
export const fetchHashAndIv = async (imageId) => {
    await connectDB();
    console.log("Fetching hash and IV for image ID:", imageId);
    
    try {
        if (!imageId) {
            console.error("No image ID provided");
            return null;
        }

        const image = await Image.findById(imageId).lean();

        if (!image) {
            console.error("Image not found with ID:", imageId);
            return null;
        }

        return {
            hash: image.hash,
            iv: image.iv,
            _id: image._id.toString(),
            fileName: image.fileName,
            uploadDate: image.uploadDate.toISOString()
        };
    } catch (error) {
        console.error("Error fetching hash and IV:", error);
        return null;
    }
};

// Function to fetch hash and IV from shared images
export const fetchSharedImageHashAndIv = async (sharedImageId) => {
    await connectDB();
    console.log("Fetching hash and IV for shared image ID:", sharedImageId);
    
    try {
        if (!sharedImageId) {
            console.error("No shared image ID provided");
            return null;
        }

        const sharedImage = await SharedImage.findById(sharedImageId).lean();

        if (!sharedImage) {
            console.error("Shared image not found with ID:", sharedImageId);
            return null;
        }

        return {
            hash: sharedImage.hash,
            iv: sharedImage.iv,
            _id: sharedImage._id.toString(),
            imageId: sharedImage.imageId.toString(),
            sender: sharedImage.sender.toString(),
            receiver: sharedImage.receiver.toString(),
            sharedAt: sharedImage.sharedAt.toISOString()
        };
    } catch (error) {
        console.error("Error fetching shared image hash and IV:", error);
        return null;
    }
};

// Decrypt the file using AES-CBC
export const decryptImage = async (
  fileHash,
  fileIv,
  fileType = "application/octet-stream"
) => {
  try {
    console.log("Fetching encrypted data from IPFS with hash:", fileHash);
    
    // Fetch encrypted data from IPFS using the hash
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${fileHash}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.status} ${response.statusText}`);
    }
    
    // Get the encrypted data as ArrayBuffer
    const encryptedData = await response.arrayBuffer();
    console.log("Encrypted data fetched from IPFS, size:", encryptedData.byteLength);
    
    // Convert base64 IV to buffer (browser-compatible)
    const ivBuffer = new Uint8Array(
      atob(fileIv)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    const keyBuffer = new TextEncoder().encode(
      "0123456789abcdef0123456789abcdef"
    );
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    
    console.log("Decrypting data with IV:", fileIv);
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: ivBuffer },
      key,
      encryptedData
    );
    
    console.log("Decryption successful, decrypted size:", decryptedData.byteLength);
    return new Blob([decryptedData], { type: fileType });
  } catch (error) {
    console.error("Error in decryptImage:", error);
    throw error;
  }
};