"use client";
import { useParams, useRouter } from "next/navigation"; // ✅ Import useRouter
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";

const UserDashboard = () => {
  const params = useParams();  // ✅ Fetch params dynamically
  const router = useRouter();  // ✅ Initialize router
  const username = params?.username;  // ✅ Extract username safely
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");  // ✅ Redirect if not authenticated
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading || status === "loading") {
    return <div className="text-white mt-96">Loading...</div>;
  }

 

  return (
    <div 
    className="text-white text-center"
    style={{ 
      backgroundImage: "url('/mainbackground.jpg')", 
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
  >
      <h1>Welcome, {session?.user?.email.split('@')[0]}!</h1>
      <FileUpload useremail={session?.user?.email} />
      
    </div>
  );
};

export default UserDashboard;
