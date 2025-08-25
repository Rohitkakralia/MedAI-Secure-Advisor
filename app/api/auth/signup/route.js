import connectDB from "@/db/connectDb";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function POST(req) {
    await connectDB();
    console.log("DB connected");
    
    try {
        console.log("Request received to create user");
        const { email, username, password } = await req.json();
        console.log("Request received to create user:", { email,username, password });
    
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email);
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }
    
        // Create a new user
        console.log("Creating new user:", { email, username, password });
         // Hash the password before saving (you should implement this function)
        const newUser = new User({ email, username, password });
        await newUser.save();

        console.log("User created successfully:", newUser);
        // You can also send a verification email or perform other actions here
    
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user: " + error.message }, { status: 500 });
    }
}