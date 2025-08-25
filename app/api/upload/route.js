import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import connectDB from "@/db/connectDb";
import mongoose from "mongoose";
import Image from "@/models/Image";
import User from "@/models/User";

export async function POST(req) {
  console.log("Request received");
  await connectDB();
  console.log("DB connected");
  
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const iv = formData.get("iv");
    const userEmail = formData.get("useremail");
    const patientName = formData.get("patientName");
    const patientAge = formData.get("patientAge");
    const patientDisease = formData.get("patientDisease");
    const patientGender = formData.get("patientGender");
    // Get the file type from the formData
    const fileType = formData.get("fileType") || file.type || "application/octet-stream";

    console.log("Patient Info.:", patientAge, patientDisease, patientGender);
    console.log("File Type:", fileType);

    if (!file || !iv || !userEmail) {
      return NextResponse.json({ 
        error: "No file, IV, or userEmail provided" 
      }, { status: 400 });
    }

    // Find the user by email to get their ObjectId
    const user = await mongoose.model('User').findOne({ email: userEmail });
    console.log("User found:", user);
    
    if (!user) {
      console.error("User not found with email:", userEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("Found user with ID:", user._id);
    console.log("File received:", file.name);
    console.log("IV received:", iv);
    console.log("user Name:", user.username);
    console.log("Patient Name:", patientName);
    console.log("Patient Age:", patientAge);
    console.log("Patient Disease:", patientDisease);
    console.log("Patient Gender:", patientGender);
    

    const pinataFormData = new FormData();
    const buffer = Buffer.from(await file.arrayBuffer());

    pinataFormData.append("file", buffer, file.name);
    pinataFormData.append("pinataMetadata", JSON.stringify({ 
      name: file.name,
      keyvalues: {
        fileType: fileType // Store file type in Pinata metadata 
      }
    }));
    pinataFormData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    console.log("Uploading encrypted file to Pinata...");

    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      pinataFormData,
      {
        headers: {
          ...pinataFormData.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    const ipfsHash = pinataResponse.data.IpfsHash;
    
    // Create and save the image record with the user's ObjectId and fileType
    const newImage = new Image({
      user: user._id,
      hash: ipfsHash,
      iv: iv,
      userName: user.username,
      fileName: file.name,
      fileType: fileType, // Store the file type in the database
      patientName: patientName || '',
      patientAge: patientAge ? parseInt(patientAge, 10) : null, // Convert to number
      patientDisease: patientDisease || '',
      patientGender: patientGender || ''
    });
    
    console.log("Saving image record to database...", newImage);
    await newImage.save();
    console.log("Image record saved to database");

    return NextResponse.json({
      hash: ipfsHash,
      iv,
      fileType,
      _id: newImage._id
    }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
  }
}