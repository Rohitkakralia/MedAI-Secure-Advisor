import connectDB from "@/db/connectDb";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    console.log("DB connected");

    const { name, email, subject, message } = await req.json();

    try {
        console.log("Request received to save contact:", { name, email, subject, message });

        // Validate input
        if (!name || !subject || !email || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Create a new contact entry
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        console.log("Contact saved successfully:", newContact);

        return NextResponse.json({ message: "Contact saved successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error saving contact:", error);
        return NextResponse.json({ error: "Failed to save contact: " + error.message }, { status: 500 });
    }
}