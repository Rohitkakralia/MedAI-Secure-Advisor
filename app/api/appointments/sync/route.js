import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
import Appointment from "@/models/Appointments";

async function fetchCalendlyUserUri(accessToken) {
  const res = await fetch("https://api.calendly.com/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  if (!res.ok || !data?.resource?.uri) {
    throw new Error("Failed to fetch Calendly user uri");
  }
  return data.resource.uri;
}

async function fetchScheduledEvents(accessToken, calendlyUserUri) {
  const url = new URL("https://api.calendly.com/scheduled_events");
  url.searchParams.set("user", calendlyUserUri);
  url.searchParams.set("status", "active");
  url.searchParams.set("count", "50");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch scheduled events");
  }
  return Array.isArray(data?.collection) ? data.collection : [];
}

async function fetchInviteesForEvent(accessToken, eventUri) {
  const res = await fetch(`${eventUri}/invitees`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  if (!res.ok) {
    return [];
  }
  return Array.isArray(data?.collection) ? data.collection : [];
}

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorEmail = session.user.email.trim().toLowerCase();

    // Get Calendly access token for this user
    const user = await User.findOne(
      { email: doctorEmail },
      "accessToken"
    ).lean();

    if (!user?.accessToken) {
      return NextResponse.json(
        { error: "Calendly not connected for this user" },
        { status: 400 }
      );
    }

    const accessToken = user.accessToken;

    // 1) Get Calendly user uri
    const calendlyUserUri = await fetchCalendlyUserUri(accessToken);

    // 2) Get active scheduled events
    const events = await fetchScheduledEvents(accessToken, calendlyUserUri);

    // 3) Upsert events into DB with first invitee's email if present
    for (const ev of events) {
      const calendlyEventUri = ev.uri;
      const startTime = ev.start_time ? new Date(ev.start_time) : null;
      const endTime = ev.end_time ? new Date(ev.end_time) : null;
      const status = ev.status || "active";

      let patientEmail = "";
      try {
        const invitees = await fetchInviteesForEvent(accessToken, calendlyEventUri);
        if (invitees.length > 0) {
          patientEmail = invitees[0]?.email?.trim().toLowerCase() || "";
        }
      } catch (_) {
        // ignore invitee fetch failures per-event
      }

      if (calendlyEventUri && startTime && endTime) {
        await Appointment.findOneAndUpdate(
          { calendlyEventUri },
          {
            doctorId: doctorEmail,
            patientEmail,
            startTime,
            endTime,
            status
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }

    // 4) Purge expired appointments (endTime < now)
    const now = new Date();
    await Appointment.deleteMany({ doctorId: doctorEmail, endTime: { $lt: now } });

    // 5) Return doctor's appointments
    const appointments = await Appointment.find({ doctorId: doctorEmail })
      .sort({ startTime: 1 })
      .lean();

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Appointments sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync appointments" },
      { status: 500 }
    );
  }
}



