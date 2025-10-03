import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/connectDb";
import Appointment from "@/models/Appointments";

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const doctorEmail = session.user.email.trim().toLowerCase();
    const { id } = params;

    const deleted = await Appointment.findOneAndDelete({ _id: id, doctorId: doctorEmail });
    if (!deleted) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}


