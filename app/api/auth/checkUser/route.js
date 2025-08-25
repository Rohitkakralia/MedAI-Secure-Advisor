import connectDB from "@/db/connectDb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        
        const { email } = await req.json();
        
        if (!email) {
            return NextResponse.json({ 
                error: "Email is required" 
            }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            return NextResponse.json({ 
                exists: true, 
                message: "User already exists with this email" 
            }, { status: 200 });
        } else {
            return NextResponse.json({ 
                exists: false, 
                message: "Email is available" 
            }, { status: 200 });
        }
        
    } catch (error) {
        console.error("Error checking user existence:", error);
        return NextResponse.json({ 
            error: "Failed to check user existence: " + error.message 
        }, { status: 500 });
    }
}
