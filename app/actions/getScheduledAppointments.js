import axios from "axios";
import User from "@/models/User";
import connectDB from "@/db/connectDb";
import mongoose from "mongoose";

export const getScheduledEvents = async (access) => {
  try {

    // const access = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzU5NDI3Nzg5LCJqdGkiOiJhOTc4OTc1Yi0xYzIxLTQ0Y2MtODZmYy0yOWUxZTRiM2MwMzciLCJ1c2VyX3V1aWQiOiI2MDAwY2FkNi02NzY2LTQ3Y2ItOGFjMy0wNTE5Y2E2MDMzOGQiLCJhcHBfdWlkIjoicjFnY2VYd1I4NFFMYzdZemgzc3J1aXp3U09oWTREcl85T3F2R1RtYjFBcyIsImV4cCI6MTc1OTQzNDk4OX0.2Vls-_2n2VI-0jPr_okg7e056r_De1LgCUuSAO58Io5M_8jo2HB97NBhgXPPXtYgapJmJsG48DhMSD52CCvr-Q";

    const userResponse = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const userData = await userResponse.json();
      const calendlyUserUri = userData.resource.uri;
    
      console.log("Calendly User URI:", calendlyUserUri);

      const response = await axios.get("https://api.calendly.com/scheduled_events", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
        params: {
          user: calendlyUserUri,   // ✅ REQUIRED
          status: "active",
          count: 20,
        },
      });
  
      console.log("Calendly events response:", response.data);
      return response.data.collection || [];
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
      return [];
    }
};

//get intivee info from this https://api.calendly.com/scheduled_events/3179b9af-c896-4b7e-b178-365049aaaf3c endpoint
export async function getEventInviteesByUri() {
    try {
        const eventUri=" https://api.calendly.com/scheduled_events/3179b9af-c896-4b7e-b178-365049aaaf3c";
        const accessToken = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzU5NDI3Nzg5LCJqdGkiOiJhOTc4OTc1Yi0xYzIxLTQ0Y2MtODZmYy0yOWUxZTRiM2MwMzciLCJ1c2VyX3V1aWQiOiI2MDAwY2FkNi02NzY2LTQ3Y2ItOGFjMy0wNTE5Y2E2MDMzOGQiLCJhcHBfdWlkIjoicjFnY2VYd1I4NFFMYzdZemgzc3J1aXp3U09oWTREcl85T3F2R1RtYjFBcyIsImV4cCI6MTc1OTQzNDk4OX0.2Vls-_2n2VI-0jPr_okg7e056r_De1LgCUuSAO58Io5M_8jo2HB97NBhgXPPXtYgapJmJsG48DhMSD52CCvr-Q";

      const response = await axios.get(`${eventUri}/invitees`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      const invitees = response.data.collection.map((invitee) => ({
        name: invitee.name,
        email: invitee.email,
        status: invitee.status,
        created_at: invitee.created_at,
      }));
      console.log(invitees);
  
      return invitees;
    } catch (error) {
      console.error("Error fetching event invitees:", error.response?.data || error.message);
      return [];
    }
  }


  export const fetchAccessToken = async (userEmail) => {
    try {
        await connectDB();
        console.log("Fetching access token for email:", userEmail);

        // Only fetch role field
        const user = await User.findOne(
            { email: userEmail },
            'accessToken' // ✅ only select accessToken
        ).lean();

        if (!user) {
            console.error("User not found with email:", userEmail);
            return null;
        }

        console.log("Access Token:", user.accessToken);

        return { accessToken: user.accessToken }; // ✅ return only accessToken
    } catch (error) {
        console.error("Error fetching user accessToken:", error);
        throw error;
    }
};