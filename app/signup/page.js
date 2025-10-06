"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  UserCheck,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Check,
  Lock,
} from "lucide-react";

const OnboardingFlow = ({ session, onComplete, email }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [doctorInfo, setDoctorInfo] = useState({
    fullName: "",
    specialty: "",
    licenseNumber: "",
    hospital: "",
    Years_in_Practice: "",
    mobile: "",
  });

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Other",
  ];

  const handleUserTypeSelection = async (type) => {
    if (type === "patient") {
      // For patients, complete onboarding immediately
      try {
        console.log("Setting role to patient", type);
        const res = await fetch("/api/setRole", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, userType: type }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("✅ Success:", data);
          setUserType(type); // Set state after successful API call
          alert("Attribute updated successfully!");
        } else {
          console.error("❌ Error:", data);
          alert(data.message || "Failed to update attribute");
        }
      } catch (error) {
        console.error("⚠️ Request failed:", error);
        alert("Something went wrong!");
      }
      handleComplete({ userType: "patient" });
    } else {
      // For doctors, go to step 2
      setUserType(type);
      setStep(2);
    }
  };

  const handleDoctorInfoSubmit = async () => {
    if (doctorInfo.fullName && doctorInfo.specialty) {
      try {
        const res = await fetch("/api/setDoctorInfo", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, userType, doctorInfo }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("✅ Success:", data);
          alert("Attribute updated successfully!");
        } else {
          console.error("❌ Error:", data);
          alert(data.message || "Failed to update attribute");
        }
      } catch (error) {
        console.error("⚠️ Request failed:", error);
        alert("Something went wrong!");
      }
      handleComplete({
        userType: "doctor",
        doctorInfo,
      });
    }
  };

  const handleComplete = (userData) => {
    // Here you would typically save to your database
    console.log("User data:", userData);
    onComplete(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-md z-10">
        {/* Progress Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">SecureVault Setup</span>
            </div>
            <span>{step === 1 ? "1/2" : "2/2"}</span>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div
              className={`bg-white rounded-full h-2 transition-all duration-300 ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            />
          </div>
        </div>

        {/* Step 1: User Type Selection */}
        {step === 1 && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {session?.user?.name?.split(" ")[0]}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Let's set up your SecureVault account
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What best describes you?
              </h3>

              <button
                onClick={() => handleUserTypeSelection("patient")}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                  userType === "patient"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
                      <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Patient
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Store and manage my health records
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>

              <button
                onClick={() => handleUserTypeSelection("doctor")}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                  userType === "doctor"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                      <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Healthcare Professional
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Manage patient records and consultations
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Information */}
        {step === 2 && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Professional Details
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Help us verify your credentials
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={doctorInfo.fullName}
                  onChange={(e) =>
                    setDoctorInfo((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical Specialty *
                </label>
                <select
                  value={doctorInfo.specialty}
                  onChange={(e) =>
                    setDoctorInfo((prev) => ({
                      ...prev,
                      specialty: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select your specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical License Number
                </label>
                <input
                  type="text"
                  value={doctorInfo.licenseNumber}
                  onChange={(e) =>
                    setDoctorInfo((prev) => ({
                      ...prev,
                      licenseNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="MD123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hospital/Clinic
                </label>
                <input
                  type="text"
                  value={doctorInfo.hospital}
                  onChange={(e) =>
                    setDoctorInfo((prev) => ({
                      ...prev,
                      hospital: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="City General Hospital"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience
                </label>
                <input
                  type="number"
                  value={doctorInfo.Years_in_Practice}
                  onChange={(e) =>
                    setDoctorInfo((prev) => ({
                      ...prev,
                      Years_in_Practice: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Experience in Years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile 
                </label>
                <input
                  type="number"
                  value={doctorInfo.mobile}
                  onChange={(e) =>
                    setDoctorInfo((prev) => ({
                      ...prev,
                      mobile: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="XXXXX-XXXXX"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleDoctorInfoSubmit}
                  disabled={!doctorInfo.fullName || !doctorInfo.specialty}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Complete Setup
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Modified LoginPage component
const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const username = session?.user?.email?.split("@")[0];
  const email = session?.user?.email;

  useEffect(() => {
    if (session) {
      // Check if user has completed onboarding (you'll need to implement this check)
      // For now, we'll assume they need onboarding
      const hasCompletedOnboarding = false; // Replace with actual check

      if (hasCompletedOnboarding) {
        router.push(`/${username}`);
      } else {
        setShowOnboarding(true);
      }
    }
  }, [session, router, username]);

  const handleOnboardingComplete = async (userData) => {
    try {
      // Save user data to your database here
      console.log("Onboarding completed:", userData);

      // After saving, redirect to dashboard
      router.push(`/${username}`);
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  // Show onboarding if user just signed in and hasn't completed onboarding
  if (showOnboarding && session) {
    return (
      <OnboardingFlow session={session} onComplete={handleOnboardingComplete} email={email}/>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-md z-10 p-1">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="relative pt-12 pb-8 px-8 text-center">
            {/* Logo container */}
            <div className="bg-white dark:bg-slate-700 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-10 w-10 text-blue-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6">
              SecureVault
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Secure healthcare document management
            </p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sign in to your account
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Access your encrypted healthcare documents securely
          </p>

          {/* Login methods */}
          <div className="space-y-4">
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 font-medium transition duration-150 ease-in-out shadow-sm"
            >
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>

            <button
              onClick={() => signIn("github")}
              className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 font-medium transition duration-150 ease-in-out shadow-sm"
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Security notes */}
          <div className="mt-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <Shield className="h-4 w-4 mr-1" />
            <span>End-to-end encrypted login</span>
          </div>
        </div>
      </div>

      {/* Bottom links */}
      <div className="absolute bottom-4 text-center text-xs text-gray-400 dark:text-gray-500">
        <div className="space-x-4">
          <a href="#" className="hover:text-blue-500 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;