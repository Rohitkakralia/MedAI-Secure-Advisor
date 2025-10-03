import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  console.log("Code after login Calendly:", code);

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    await connectDB();

    // Step 1: Exchange code for tokens
    const tokenResponse = await fetch("https://auth.calendly.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.CALENDLY_REDIRECT_URI,
        client_id: process.env.CALENDLY_CLIENT_ID,
        client_secret: process.env.CALENDLY_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log("Token data after login Calendly:", tokenData);

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Failed to get access token", details: tokenData },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Step 2: Fetch user profile from Calendly
    const userResponse = await fetch("https://api.calendly.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userResponse.json();
    const calendlyUser = userData.resource;

    console.log("User data after login Calendly:", userData);
    console.log("Calendly user after login Calendly:", calendlyUser);

    if (!calendlyUser?.email) {
      return NextResponse.json(
        { error: "Failed to fetch Calendly user profile", details: userData },
        { status: 400 }
      );
    }

    console.log("Updating user:", calendlyUser.email);
    console.log("Scheduling URL:", calendlyUser.scheduling_url);
    console.log("Access Token:", tokenData.access_token);
    console.log("Refresh Token:", tokenData.refresh_token);
    console.log("Expires At:", tokenExpiresAt);

    const existingUser = await User.findOne({ email: calendlyUser.email.trim().toLowerCase() });
    console.log("Existing user in DB:", existingUser);
    // Step 3: Save Calendly data into your User schema
    const user = await User.findOneAndUpdate(
      { email: calendlyUser.email.trim().toLowerCase() },
      {
        calendlyLink: calendlyUser.scheduling_url || '',
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiresAt: tokenExpiresAt
      },
      { new: true }
    );

    console.log("User after login Calendly:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found in your system" },
        { status: 404 }
      );
    }


    // Step 4: Register webhook (if not already done)
    try {
      // Check existing webhooks first
      const existingWebhooksRes = await fetch(
        "https://api.calendly.com/webhook_subscriptions",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const existingWebhooks = await existingWebhooksRes.json();

      const alreadyRegistered = existingWebhooks.collection?.some(
        (hook) => hook.url === `${process.env.NEXT_PUBLIC_APP_URL}/api/calendly/webhook`
      );

      if (!alreadyRegistered) {
        const webhookRes = await fetch(
          "https://api.calendly.com/webhook_subscriptions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              url: `${process.env.NEXT_PUBLIC_APP_URL}/api/calendly/webhook`,
              events: ["invitee.created", "invitee.canceled"],
              organization: calendlyUser.current_organization,
            }),
          }
        );

        const webhookData = await webhookRes.json();
        console.log("✅ Webhook registered:", webhookData);
      } else {
        console.log("ℹ️ Webhook already registered, skipping...");
      }
    } catch (err) {
      console.error("⚠️ Failed to register webhook:", err);
    }
    

    // Step 5: Redirect back to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?calendly=connected`
    );
  } catch (error) {
    console.error("Calendly OAuth Error:", error);
    return NextResponse.json(
      { error: "Error connecting to Calendly" },
      { status: 500 }
    );
  }
}
