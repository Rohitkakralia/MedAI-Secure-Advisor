// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/db/connectDb";
 import Appointment from "@/models/Appointments";




// app/api/patients/[id]/vital-history/route.js
// app/api/patients/[id]/vital-history/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/connectDb";
import Patient from "@/models/Patient";

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

export async function GET(request, { params }) {
  try {
    await connectDB();

    console.log(request);
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log(id);
    const doctorEmail = session.user.email.trim().toLowerCase();

    // Get time range from query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30days";

    // Find patient and verify doctor access
    const patient = await Patient.findOne({
      _id: id,
      doctorEmail: doctorEmail,
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found or access denied" },
        { status: 404 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get treatment history within time range
    const treatmentHistory = patient.treatmentHistory
      .filter((t) => new Date(t.date) >= startDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extract vital data
    const vitalData = {
      bloodPressure: treatmentHistory
        .filter(
          (t) =>
            t.vitalSigns?.bloodPressure?.systolic &&
            t.vitalSigns?.bloodPressure?.diastolic
        )
        .map((t) => ({
          date: t.date,
          systolic: t.vitalSigns.bloodPressure.systolic,
          diastolic: t.vitalSigns.bloodPressure.diastolic,
          appointmentId: t.appointmentId,
        })),
      heartRate: treatmentHistory
        .filter((t) => t.vitalSigns?.heartRate?.value)
        .map((t) => ({
          date: t.date,
          value: t.vitalSigns.heartRate.value,
          appointmentId: t.appointmentId,
        })),
      weight: treatmentHistory
        .filter((t) => t.vitalSigns?.weight?.value)
        .map((t) => ({
          date: t.date,
          value: t.vitalSigns.weight.value,
          appointmentId: t.appointmentId,
        })),
      temperature: treatmentHistory
        .filter((t) => t.vitalSigns?.temperature?.value)
        .map((t) => ({
          date: t.date,
          value: t.vitalSigns.temperature.value,
          appointmentId: t.appointmentId,
        })),
      oxygenSaturation: treatmentHistory
        .filter((t) => t.vitalSigns?.oxygenSaturation?.value)
        .map((t) => ({
          date: t.date,
          value: t.vitalSigns.oxygenSaturation.value,
          appointmentId: t.appointmentId,
        })),
      height: treatmentHistory
        .filter((t) => t.vitalSigns?.height?.value)
        .map((t) => ({
          date: t.date,
          value: t.vitalSigns.height.value,
          appointmentId: t.appointmentId,
        })),
    };

    // Add current vitals if empty
    const addCurrentVitalsIfEmpty = () => {
      const currentDate = new Date().toISOString().split("T")[0];

      if (
        vitalData.bloodPressure.length === 0 &&
        patient.vitalSigns?.bloodPressure
      ) {
        vitalData.bloodPressure.push({
          date: currentDate,
          systolic: patient.vitalSigns.bloodPressure.systolic,
          diastolic: patient.vitalSigns.bloodPressure.diastolic,
          isCurrent: true,
        });
      }

      if (
        vitalData.heartRate.length === 0 &&
        patient.vitalSigns?.heartRate?.value
      ) {
        vitalData.heartRate.push({
          date: currentDate,
          value: patient.vitalSigns.heartRate.value,
          isCurrent: true,
        });
      }

      if (vitalData.weight.length === 0 && patient.vitalSigns?.weight?.value) {
        vitalData.weight.push({
          date: currentDate,
          value: patient.vitalSigns.weight.value,
          isCurrent: true,
        });
      }

      if (
        vitalData.temperature.length === 0 &&
        patient.vitalSigns?.temperature?.value
      ) {
        vitalData.temperature.push({
          date: currentDate,
          value: patient.vitalSigns.temperature.value,
          isCurrent: true,
        });
      }

      if (
        vitalData.oxygenSaturation.length === 0 &&
        patient.vitalSigns?.oxygenSaturation?.value
      ) {
        vitalData.oxygenSaturation.push({
          date: currentDate,
          value: patient.vitalSigns.oxygenSaturation.value,
          isCurrent: true,
        });
      }

      if (vitalData.height.length === 0 && patient.vitalSigns?.height?.value) {
        vitalData.height.push({
          date: currentDate,
          value: patient.vitalSigns.height.value,
          isCurrent: true,
        });
      }
    };

    addCurrentVitalsIfEmpty();

    return NextResponse.json(vitalData);
  } catch (error) {
    console.error("Get vital history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vital history" },
      { status: 500 }
    );
  }
}
