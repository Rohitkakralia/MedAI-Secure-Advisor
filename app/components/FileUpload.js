import { useState, useEffect, useRef } from "react";
import { fetchUser, fetchRole } from "../actions/fetchDetails";
import { fetchUploads } from "../actions/fetchDetails";
import { useSession } from "next-auth/react";
import { Sparkles, Plus, Stethoscope, Heart, BarChart3 } from "lucide-react";
import Chatbot from "./chatbot";
import DoctorAnalyzer from "./DoctorAnalyzer";

export default function FileUpload({ useremail }) {

  const { data: session, status } = useSession();

  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientDisease, setPatientDisease] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [decryptedImage, setDecryptedImage] = useState(null);
  const [iv, setIv] = useState(""); // IV for current upload
  const [uploadHistory, setUploadHistory] = useState([]); // List of uploads from MongoDB
  const [filteredHistory, setFilteredHistory] = useState([]); // Filtered history based on search
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [searchFilter, setSearchFilter] = useState("all"); // Search filter state
  const [isModalOpen, setIsModalOpen] = useState(false); // For enlarged image view
  const [isDragging, setIsDragging] = useState(false);
  const [role, setRole] = useState(""); // For drag and drop state

  const [openAI, setOpenAI] = useState(false);
  const [openAnalyzer, setOpenAnalyzer] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null); // Reference to the file input element

  //setShowCalendlyPopup
  const [showCalendlyPopup, setShowCalendlyPopup] = useState(false);


  // Extract username from useremail (part before @ symbol)
  const userEmail = useremail ? useremail : "";
  console.log("User userEmail1:", userEmail);
 


  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI;

    const url = `https://auth.calendly.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    window.location.href = url;
  };
  
  // Function to fetch upload history from your backend (MongoDB)
  
  
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const getData = async () => {
        try {
          const userEmail = session.user.email;
          console.log("User userEmail2:", userEmail);
          const user = await fetchUser(userEmail);
          const images = await fetchUploads(user);
          const rol = await fetchRole(userEmail);
  
          setRole(rol.role);
          setUploadHistory(images);
          setFilteredHistory(images);

          if (
            rol.role === "doctor" &&
            (user?.calendlyLink)
          ) {
            setShowCalendlyPopup(true); // show modal
          }

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      getData();
    }
  }, [status, session]);

  // Search function to filter the upload history
  const handleSearch = (query, filter) => {
    setSearchQuery(query);
    setSearchFilter(filter);

    if (!query.trim()) {
      setFilteredHistory(uploadHistory); // Reset to show all results
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = uploadHistory.filter((upload) => {
      if (filter === "all") {
        return (
          (upload.patientName &&
            upload.patientName.toLowerCase().includes(lowerQuery)) ||
          (upload.patientAge &&
            upload.patientAge.toString().includes(lowerQuery)) ||
          (upload.patientDisease &&
            upload.patientDisease.toLowerCase().includes(lowerQuery)) ||
          (upload.patientGender &&
            upload.patientGender.toLowerCase().includes(lowerQuery))
        );
      } else if (filter === "name") {
        return (
          upload.patientName &&
          upload.patientName.toLowerCase().includes(lowerQuery)
        );
      } else if (filter === "age") {
        return (
          upload.patientAge && upload.patientAge.toString().includes(lowerQuery)
        );
      } else if (filter === "disease") {
        return (
          upload.patientDisease &&
          upload.patientDisease.toLowerCase().includes(lowerQuery)
        );
      } else if (filter === "gender") {
        return (
          upload.patientGender &&
          upload.patientGender.toLowerCase().includes(lowerQuery)
        );
      }
      return false;
    });

    setFilteredHistory(filtered);
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file input change
  const handleInputChange = (event) => {
    handleFileChange(event.target.files[0]);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    console.log("Form Data Values:", {
      useremail,
      patientName,
      patientAge,
      patientDisease,
      patientGender,
      file,
      fileType: file.type, // Store file type
    });
    setLoading(true);
    try {
      const { encryptedData, iv } = await encryptImage(file);
      const encryptedFile = new File([encryptedData], file.name, {
        type: file.type,
      });

      const formData = new FormData();
      formData.append("file", encryptedFile);
      formData.append("iv", iv);
      formData.append("useremail", useremail || "");
      formData.append("patientName", patientName || "");
      formData.append("patientAge", patientAge || "");
      formData.append("patientDisease", patientDisease || "");
      formData.append("patientGender", patientGender || "");
      formData.append("fileType", file.type); // Store original file type

      console.log("formData:", formData.get("patientName"));
      console.log("formData:", formData.get("patientAge"));
      console.log("formData:", formData.get("patientDisease"));
      console.log("formData:", formData.get("patientGender"));
      console.log("formData fileType:", formData.get("fileType"));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      if (data.hash) {
        setHash(data.hash);
        setIv(iv);
        // After a successful upload, re-fetch the uploads from MongoDB
        getData();
      } else {
        alert("Upload failed: Hash not found");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed");
    }
    setLoading(false);
  };

  // Decrypt the most recent upload
  const handleDecrypt = async () => {
    if (!hash) return alert("No encrypted file to decrypt");
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      if (!response.ok) throw new Error("Failed to download encrypted file");
      const encryptedData = new Uint8Array(await response.arrayBuffer());

      // Get the file type for the current upload
      const fileType = file ? file.type : "application/octet-stream";

      const decryptedBlob = await decryptImage(encryptedData, iv, fileType);

      setDecryptedImage({
        url: URL.createObjectURL(decryptedBlob),
        type: fileType,
      });
    } catch (error) {
      console.error("Decryption error:", error);
      alert("Failed to decrypt file");
    }
  };

  // Decrypt an image from upload history
  const handleDecryptHistory = async (record) => {
    try {
      const response = await fetch(
        `https://gateway.pinata.cloud/ipfs/${record.hash}`
      );
      if (!response.ok) throw new Error("Failed to download encrypted file");
      const encryptedData = new Uint8Array(await response.arrayBuffer());

      // Use the fileType from the record or default to a generic type
      const fileType = record.fileType || "application/octet-stream";

      const decryptedBlob = await decryptImage(
        encryptedData,
        record.iv,
        fileType
      );

      // Create an object URL from the blob
      const url = URL.createObjectURL(decryptedBlob);

      setDecryptedImage({
        url: url,
        type: fileType,
        name: record.fileName || "Decrypted File",
      });

      // Automatically download the file if it's not an image
      // if (!fileType.startsWith('image/')) {
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.download = record.fileName || "decrypted-file";
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      // }
    } catch (error) {
      console.error("Decryption error:", error);
      alert("Failed to decrypt file from history");
    }
  };

  // Add this function to your component
  const handleDeleteHistory = async (upload) => {
    if (!upload || !upload._id) {
      console.error("Cannot delete record: Invalid upload data or missing ID");
      return;
    }

    // Confirm deletion with the user
    if (
      !confirm(
        `Are you sure you want to delete this record for patient ${upload.patientName}?`
      )
    ) {
      return;
    }

    try {
      // Show loading state
      setLoading(true);
      const imageId = upload._id; // Get the ID of the image to delete
      console.log("Deleting record with ID:", imageId);
      // Make API call to delete the record from the database
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete record");
      }

      // Update the local state by removing the deleted record
      setUploadHistory((prevHistory) =>
        prevHistory.filter((record) => record._id !== upload._id)
      );

      // Also update filtered history if search is active
      setFilteredHistory((prevFiltered) =>
        prevFiltered.filter((record) => record._id !== upload._id)
      );

      // Show success message
      alert("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert(`Failed to delete record: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hide the decrypted image
  const handleHideImage = () => {
    setDecryptedImage(null);
  };

  // Open modal for enlarged view
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" min-h-screen py-6">

      {/* Calendly Connect Box (Top Right) */}
      {showCalendlyPopup && (
  <div className="fixed top-4 right-4 z-50">
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-6 rounded-2xl shadow-2xl flex items-start gap-4 relative border border-blue-300 w-80 min-h-[160px]">
      
      {/* Cross Button */}
      <button
        onClick={() => setShowCalendlyPopup(false)}
        className="absolute -top-3 -right-3 bg-white text-gray-600 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition"
      >
        ×
      </button>

      {/* Icon */}
      <div className="bg-white text-blue-600 rounded-full p-3 shadow-md mt-1">
        <svg xmlns="http://www.w3.org/2000/svg"
             className="h-7 w-7"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Text + Buttons */}
      <div className="flex-1">
        <h2 className="text-lg font-bold">Connect Calendly</h2>
        <p className="text-sm text-blue-100 mt-1 mb-4">
          Connect Calendly to start using the appointment feature and manage your schedules easily.
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleConnect}
            className="bg-white text-blue-600 font-medium ml-[-20px] px-3 py-1.5 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Connect
          </button>
          <button
            onClick={() => setShowCalendlyPopup(false)}
            className="bg-transparent border border-white text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Skip this time
          </button>
        </div>
      </div>
    </div>
  </div>
)}



      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Medical Record Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-row-2 gap-6">
          {/* Upload Section */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* <div className="w-full md:w-1/3 space-y-6"> */}
            {/* Statistics Card */}

            {/* Suggestions Card */}
            {/* <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Suggested Actions
              </h3>
            </div>
            
            <div className="p-5">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Complete patient profile</p>
                    <p className="text-xs text-blue-600">Add more details to improve record accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Schedule follow-up</p>
                    <p className="text-xs text-green-600">Next check-up is due in 2 weeks</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-700">Update medication list</p>
                    <p className="text-xs text-amber-600">Last updated 30 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
            {/* </div> */}

            <div className="w-full md:w-full w-8xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500 rounded-full opacity-20 -mr-16 -mt-16"></div>
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-blue-800 rounded-full opacity-20 -ml-12 -mb-12"></div>
                <h2 className="text-2xl font-bold text-white flex items-center relative z-10">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                  </div>
                  Medical Record Uploader
                </h2>
                <p className="text-blue-100 ml-12 mt-1">
                  Secure, encrypted storage for patient records
                </p>
              </div>

              <div className="p-6">
                <div className="flex md:flex-row flex-col lg:flex-row w-full gap-4 mb-6">
                  {/* Upload Statistics Card - takes full width on mobile, 1/3 on larger screens */}
                  <div className="bg-white w-full md:w-1/3 lg:w-1/3 rounded-2xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          ></path>
                        </svg>
                        Upload Statistics
                      </h3>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-4xl text-gray-500">
                            Total Uploads
                          </p>
                          <p className="text-3xl md:text-3xl font-bold text-gray-800 mt-2">
                            {uploadHistory.length}
                          </p>
                        </div>
                        <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                          <svg
                            className="w-6 h-6 md:w-8 md:h-8 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Information Form - takes full width on mobile, 2/3 on larger screens */}
                  <div className="bg-white p-4 md:w-2/3 md:p-5 w-full lg:w-2/3 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 md:mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      Patient Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="group">
                        <label
                          htmlFor="patientName"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
                        >
                          Patient Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="patientName"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Full name"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label
                          htmlFor="patientAge"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
                        >
                          Patient Age
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                          </div>
                          <input
                            type="number"
                            id="patientAge"
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            min="0"
                            max="150"
                            className="w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Age"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label
                          htmlFor="patientDisease"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
                        >
                          Patient Condition
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="patientDisease"
                            value={patientDisease}
                            onChange={(e) => setPatientDisease(e.target.value)}
                            className="w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Medical condition"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label
                          htmlFor="patientGender"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
                        >
                          Patient Gender
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                          </div>
                          <select
                            id="patientGender"
                            value={patientGender}
                            onChange={(e) => setPatientGender(e.target.value)}
                            className="w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          >
                            <option value="" disabled>
                              Select gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  className={`relative bg-white rounded-xl ${
                    isDragging
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "border-2 border-dashed border-gray-300"
                  } 
          p-6 text-center flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300 hover:bg-blue-50 mb-6 overflow-hidden`}
                  onClick={() => fileInputRef.current.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -mr-8 -mt-8 opacity-70"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-100 rounded-full -ml-6 -mb-6 opacity-70"></div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  <div
                    className={`mb-4 transform transition-transform ${
                      isDragging ? "scale-110" : ""
                    }`}
                  >
                    <div className="bg-blue-100 rounded-full p-4 mx-auto">
                      <svg
                        className="w-10 h-10 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {isDragging
                      ? "Drop your file here"
                      : "Drag & drop your medical record"}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    or{" "}
                    <span className="text-blue-600 font-medium underline">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported formats: PDF, JPG, PNG, DOCX
                  </p>

                  {file && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg max-w-full flex items-center border border-blue-100">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <p className="text-sm text-blue-700 font-medium truncate">
                        {file.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  className={`relative overflow-hidden font-semibold px-6 py-3 rounded-lg w-full transition-all duration-300 flex items-center justify-center ${
                    loading ||
                    !file ||
                    !patientName ||
                    !patientAge ||
                    !patientDisease
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800"
                  }`}
                  disabled={
                    loading ||
                    !file ||
                    !patientName ||
                    !patientAge ||
                    !patientDisease
                  }
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Upload...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                      Upload & Secure Encrypt
                    </>
                  )}

                  {/* Decorative dot animation when button is active */}
                  {!loading &&
                    file &&
                    patientName &&
                    patientAge &&
                    patientDisease && (
                      <>
                        <span className="absolute right-0 top-0 h-3 w-3 bg-blue-300 rounded-full opacity-70 animate-ping"></span>
                        <span className="absolute right-0 top-0 h-3 w-3 bg-blue-400 rounded-full"></span>
                      </>
                    )}
                </button>

                {/* Upload Success Section */}
                {hash && (
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl overflow-hidden shadow-sm border border-blue-100 transform transition-all duration-500 animate-fadeIn">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3">
                      <div className="flex items-center text-white">
                        <div className="bg-white/20 p-1 rounded-full">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </div>
                        <span className="font-bold ml-2">
                          Upload Complete & Encrypted
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
                        <p className="font-semibold mb-3 text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          Patient Information
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500 text-xs">Name</p>
                            <p className="font-medium text-gray-700">
                              {patientName}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500 text-xs">Age</p>
                            <p className="font-medium text-gray-700">
                              {patientAge}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500 text-xs">Condition</p>
                            <p className="font-medium text-gray-700">
                              {patientDisease}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500 text-xs">Gender</p>
                            <p className="font-medium text-gray-700">
                              {patientGender || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-semibold text-sm mb-2 flex items-center text-gray-700">
                          <svg
                            className="w-4 h-4 mr-2 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            ></path>
                          </svg>
                          Encrypted Record Hash
                        </p>
                        <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto flex items-center">
                          <svg
                            className="flex-shrink-0 w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                            ></path>
                          </svg>
                          <span className="break-all tracking-wider">
                            {hash}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            ></path>
                          </svg>
                          View on IPFS
                        </a>

                        <button
                          onClick={handleDecrypt}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                            ></path>
                          </svg>
                          Decrypt & View Record
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Upload History
              </h2>
            </div>

            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      className="w-full text-black p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Search patient records..."
                      value={searchQuery}
                      onChange={(e) =>
                        handleSearch(e.target.value, searchFilter)
                      }
                    />
                    <svg
                      className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <select
                    className="text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchFilter}
                    onChange={(e) => handleSearch(searchQuery, e.target.value)}
                  >
                    <option value="all">All Fields</option>
                    <option value="name">Patient Name</option>
                    <option value="age">Age</option>
                    <option value="disease">Disease</option>
                    <option value="gender">Gender</option>
                  </select>
                </div>
              </div>

              {/* Records List */}
              {filteredHistory.length === 0 ? (
                <div className="rounded-xl p-8 text-center h-64 flex flex-col items-center justify-center bg-gray-50">
                  {uploadHistory.length === 0 ? (
                    <>
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No uploads yet
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Patient records will appear here after upload
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">
                        No matching results found
                      </p>
                      <button
                        onClick={() => handleSearch("", "all")}
                        className="mt-3 text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        Clear search
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-y-auto max-h-96 pr-1">
                  {filteredHistory.map((upload, index) => (
                    <div
                      key={upload._id || index}
                      className="border border-gray-200 rounded-xl mb-3 overflow-hidden"
                    >
                      <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            {upload.fileName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(upload.uploadDate).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <span className="text-xs text-gray-500">
                              Patient Name
                            </span>
                            <p className="font-medium text-black">
                              {upload.patientName || "N/A"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <span className="text-xs text-gray-500">Age</span>
                            <p className="font-medium text-black">
                              {upload.patientAge || "N/A"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <span className="text-xs text-gray-500">
                              Disease
                            </span>
                            <p className="font-medium text-black">
                              {upload.patientDisease || "N/A"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <span className="text-xs text-gray-500">
                              Gender
                            </span>
                            <p className="font-medium text-black">
                              {upload.patientGender || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <a
                            href={`https://gateway.pinata.cloud/ipfs/${upload.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              ></path>
                            </svg>
                            View on IPFS
                          </a>
                          <button
                            onClick={() => handleDecryptHistory(upload)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                              ></path>
                            </svg>
                            Decrypt with {upload.iv}
                          </button>
                          <button
                            onClick={() => handleDeleteHistory(upload)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6h16zM10 11v6M14 11v6"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decrypted Image Section */}
        {/* Decrypted File Section */}
        {decryptedImage && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Decrypted Medical Record: {decryptedImage.name}
              </h2>
              <div className="flex space-x-2">
                <a
                  href={decryptedImage.url}
                  download={decryptedImage.name || "download"}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 flex items-center justify-center transition-colors duration-200"
                  title="Download File"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                </a>
                <button
                  onClick={handleHideImage}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 flex items-center justify-center transition-colors duration-200"
                  title="Hide File"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 flex justify-center">
              {decryptedImage.type.startsWith("image/") ? (
                <img
                  src={decryptedImage.url}
                  alt="Decrypted Medical Record"
                  className="max-h-96 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={handleImageClick}
                />
              ) : decryptedImage.type === "application/pdf" ? (
                <div className="w-full h-96 rounded-lg shadow-md border border-gray-200">
                  <object
                    data={decryptedImage.url}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="rounded-lg"
                  >
                    <p>
                      PDF cannot be displayed. Please
                      <a
                        href={decryptedImage.url}
                        download={decryptedImage.name || "download"}
                        className="text-blue-600 hover:underline"
                      >
                        {" "}
                        download{" "}
                      </a>
                      to view.
                    </p>
                  </object>
                </div>
              ) : (
                <div className="text-center bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-sm w-full">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {decryptedImage.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    File type: {decryptedImage.type}
                  </p>
                  <a
                    href={decryptedImage.url}
                    download={decryptedImage.name || "download"}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      ></path>
                    </svg>
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for enlarged image */}
        {isModalOpen && decryptedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                title="Close Enlarged View"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>

              {/* Display image if it's an image file */}
              {decryptedImage.type.startsWith("image/") && (
                <img
                  src={decryptedImage.url}
                  alt="Enlarged Medical Record"
                  className="max-w-full max-h-[85vh] rounded-lg shadow-2xl mx-auto"
                />
              )}

              {/* Display PDF in an iframe if it's a PDF */}
              {decryptedImage.type === "application/pdf" && (
                <iframe
                  src={decryptedImage.url}
                  title="PDF Document"
                  className="w-full h-[85vh] rounded-lg shadow-2xl bg-white"
                />
              )}

              {/* For other document types, you might want to add viewers or fallback */}
              {!decryptedImage.type.startsWith("image/") &&
                decryptedImage.type !== "application/pdf" && (
                  <div className="w-full h-[85vh] rounded-lg shadow-2xl bg-white p-4 flex flex-col items-center justify-center">
                    <p className="text-lg mb-4">
                      Document preview not available for {decryptedImage.type}
                    </p>
                    <a
                      href={decryptedImage.url}
                      download={decryptedImage.name || "document"}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Download File
                    </a>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/*chatbot button */}
      {role==="patient" && (
      <div className="fixed bottom-4 right-4 z-[9999] flex items-end flex-col gap-2">
        {/* Animated text */}
        {!openAI && (
          <div
            className={`bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md transition-all duration-300 transform ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-sm font-medium text-gray-800 flex items-center">
              <span className="mr-1">Start your chat with</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                MedChat AI
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 animate-bounce"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        )}

        {!openAI ? (
          <div className="relative">
            {/* Pulse animation rings */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-16 h-16 rounded-full bg-blue-400 opacity-20"></div>
            </div>
            <div className="absolute inset-0 animate-pulse delay-75">
              <div className="w-16 h-16 rounded-full bg-teal-400 opacity-15"></div>
            </div>

            {/* Main button */}
            <button
              className={`
          relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform
          bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500
          hover:from-blue-600 hover:via-blue-700 hover:to-teal-600
          ${isHovered ? "scale-110" : "scale-100"}
          group overflow-hidden
        `}
              onClick={() => setOpenAI(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>

              {/* Sparkle effects */}
              <div className="absolute top-2 right-2">
                <Sparkles
                  size={8}
                  className="text-white/60 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <div className="absolute bottom-3 left-2">
                <Sparkles
                  size={6}
                  className="text-white/40 animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              {/* Medical cross background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Plus size={32} className="text-white" />
              </div>

              {/* Main icons */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="relative">
                  {/* Stethoscope icon */}
                  <Stethoscope
                    size={18}
                    className={`text-white transition-all duration-300 ${
                      isHovered ? "transform -translate-y-1" : ""
                    }`}
                  />

                  {/* Heart icon that appears on hover */}
                  <Heart
                    size={10}
                    className={`absolute -bottom-1 -right-1 text-red-300 transition-all duration-300 ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
                  />
                </div>
              </div>

              {/* Tooltip */}
              <div
                className={`
            absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs 
            rounded-lg whitespace-nowrap transition-all duration-200 pointer-events-none
            ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            }
          `}
              >
                Ask your health questions
                <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>

            {/* Floating medical icons */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
              <Heart size={8} className="text-red-500" />
            </div>

            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 p-8 overflow-hidden">
            <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-300 w-full h-full flex items-center justify-center">
              <Chatbot useremail={userEmail} onClose={() => setOpenAI(false)} />
            </div>
          </div>
        )}
      </div>
      )}

      {/* Doctor Analyzer button */}
      {role === "doctor" && (
        <div className="fixed bottom-4 right-4 z-[9999] flex items-end flex-col gap-2">
          {/* Animated text */}
          {!openAnalyzer && (
            <div
              className={`bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md transition-all duration-300 transform ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="text-sm font-medium text-gray-800 flex items-center">
                <span className="mr-1">Access advanced</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                  Doctor Analyzer
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 animate-bounce"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          )}

          {!openAnalyzer ? (
            <div className="relative">
              {/* Pulse animation rings */}
              <div className="absolute inset-0 animate-ping">
                <div className="w-16 h-16 rounded-full bg-indigo-400 opacity-20"></div>
              </div>
              <div className="absolute inset-0 animate-pulse delay-75">
                <div className="w-16 h-16 rounded-full bg-purple-400 opacity-15"></div>
              </div>

              {/* Main button */}
              <button
                className={`
          relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform
          bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-500
          hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-600
          ${isHovered ? "scale-110" : "scale-100"}
          group overflow-hidden
        `}
                onClick={() => setOpenAnalyzer(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>

                {/* Sparkle effects */}
                <div className="absolute top-2 right-2">
                  <BarChart3
                    size={8}
                    className="text-white/60 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
                <div className="absolute bottom-3 left-2">
                  <BarChart3
                    size={6}
                    className="text-white/40 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </div>

                {/* Medical cross background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Plus size={32} className="text-white" />
                </div>

                {/* Main icons */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="relative">
                    {/* BarChart icon */}
                    <BarChart3
                      size={18}
                      className={`text-white transition-all duration-300 ${
                        isHovered ? "transform -translate-y-1" : ""
                      }`}
                    />

                    {/* Stethoscope icon that appears on hover */}
                    <Stethoscope
                      size={10}
                      className={`absolute -bottom-1 -right-1 text-blue-300 transition-all duration-300 ${
                        isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Tooltip */}
                <div
                  className={`
            absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs 
            rounded-lg whitespace-nowrap transition-all duration-200 pointer-events-none
            ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            }
          `}
                >
                  Analyze patient data
                  <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </button>

              {/* Floating medical icons */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                <BarChart3 size={8} className="text-blue-500" />
              </div>

              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
              <DoctorAnalyzer useremail={userEmail} onClose={() => setOpenAnalyzer(false)} />
            </div>
          )}
        </div>
      )}
    </div>

  );
}

// Encrypt the file using AES-CBC
async function encryptImage(file) {
  const iv = crypto.getRandomValues(new Uint8Array(16)); // 16-byte IV
  const keyBuffer = new TextEncoder().encode(
    "0123456789abcdef0123456789abcdef"
  ); // 32-byte key
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  const fileBuffer = await file.arrayBuffer();
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    fileBuffer
  );
  return {
    encryptedData: new Uint8Array(encryptedData),
    iv: Buffer.from(iv).toString("base64"),
  };
}

// Decrypt the file using AES-CBC
async function decryptImage(
  encryptedData,
  iv,
  fileType = "application/octet-stream"
) {
  const ivBuffer = new Uint8Array(Buffer.from(iv, "base64"));
  const keyBuffer = new TextEncoder().encode(
    "0123456789abcdef0123456789abcdef"
  );
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBuffer },
    key,
    encryptedData
  );
  return new Blob([decryptedData], { type: fileType });
}
