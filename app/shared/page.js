"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { fetchUser } from "../actions/fetchDetails";
import { fetchUploads } from "../actions/fetchDetails";
import { fetchImageDetails } from "../actions/fetchDetails";
import { fetchReceivedImage } from "../actions/fetchDetails";

const Page = () => {
    const { data: session, status } = useSession();
    const [receiverId, setReceiverId] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const [receiverUsername, setReceiverUsername] = useState('');
    const [uploadHistory, setUploadHistory] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [receivedImages, setreceivedImages] = useState([]);
    const [sharedByMeImages, setSharedByMeImages] = useState([]);
    const [activeTab, setActiveTab] = useState('shared');
    const [userData, setUserData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchAttribute, setSearchAttribute] = useState('patientName');
    const [filteredUploadHistory, setFilteredUploadHistory] = useState([]);
    const [filteredSharedByMeImages, setFilteredSharedByMeImages] = useState([]);
    
    // New state for viewer modal
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    
    const router = useRouter();
    
    useEffect(() => {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status, router]);
    
    useEffect(() => {
      if (status === "authenticated" && session?.user?.email) {
        fetchUserData(session.user.email);
      }
    }, [status, session]);
    
    useEffect(() => {
      const timer = setTimeout(() => {
          if (searchTerm.trim() === '') {
              setFilteredUploadHistory(uploadHistory);
              setFilteredSharedByMeImages(sharedByMeImages);
              return;
          }
  
          const filteredUploads = uploadHistory.filter(image => {
              const value = image[searchAttribute];
              if (typeof value === 'string') {
                  return value.toLowerCase().includes(searchTerm.toLowerCase());
              } else if (typeof value === 'number') {
                  return value.toString().includes(searchTerm);
              }
              return false;
          });
          setFilteredUploadHistory(filteredUploads);
  
          const filteredShared = sharedByMeImages.filter(image => {
              const value = image[searchAttribute];
              if (typeof value === 'string') {
                  return value.toLowerCase().includes(searchTerm.toLowerCase());
              } else if (typeof value === 'number') {
                  return value.toString().includes(searchTerm);
              }
              return false;
          });
          setFilteredSharedByMeImages(filteredShared);
      }, 300);
  
      return () => clearTimeout(timer);
    }, [searchTerm, searchAttribute, uploadHistory, sharedByMeImages]);
    
    const fetchUserData = async (email) => {
        setLoading(true);
        try {
            const userData = await fetchUser(email);
            setUserData(userData);

            if (userData) {
                const images = await fetchUploads(userData);
                const imagesReceived = await fetchReceivedImage(userData);
                setUploadHistory(images);
                setFilteredUploadHistory(images);
                setreceivedImages(imagesReceived);
                fetchSharedByMeImages(userData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchSharedByMeImages = async (userId) => {
        setLoading(true);
        try {
            const response = await fetch('/api/getSharedByMeImages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ senderId: userId }),
            });
            
            if (response.ok) {
                const data = await response.json();
                setSharedByMeImages(data);
                setFilteredSharedByMeImages(data);
            } else {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch shared images");
            }
        } catch (error) {
            console.error("Error fetching shared by me images:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const getReceiverId = async () => {
        if (!receiverEmail) {
            alert("Please enter receiver's email");
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch('/api/getRecieversId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiverEmail: receiverEmail }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setReceiverId(data.receiverId);
                setReceiverUsername(data.receiverUsername);
            } else {
                alert(data.error || "Failed to get receiver information");
            }
        } catch (error) {
            console.error("Error fetching receiver data:", error);
            alert("An error occurred while fetching receiver data");
        } finally {
            setLoading(false);
        }
    };

    const toggleImageSelection = (image) => {
        setSelectedImages(prev => {
          const isSelected = prev.some(item => item._id === image._id);
          
          if (isSelected) {
            return prev.filter(item => item._id !== image._id);
          } else {
            return [...prev, image];
          }
        });
    };
    
    const shareSelectedImages = async () => {
        if (!receiverId) {
            alert("Please get receiver's ID first");
            return;
        }
        
        if (selectedImages.length === 0) {
            alert("Please select at least one image to share");
            return;
        }
        
        const selectedImageIds = selectedImages[0]._id; 
        let imageDetails = await fetchImageDetails(selectedImages);
        
        setLoading(true);
        try {
            const response = await fetch('/api/shareImages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId,
                    receiverEmail,
                    receiverUsername,
                    imageDetails
                }),
            });
            
            const data = await response.json();
            if (response.ok) {
                alert("Images shared successfully");
                if (userData) {
                    fetchSharedByMeImages(userData);
                }
            } else {
                throw new Error(data.message || "Failed to share images");
            }
        } catch (error) {
            console.error("Error sharing images:", error);
            alert("Failed to share images: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const decryptImage = async (encryptedData, iv) => {
        try {
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
            
            return new Blob([decryptedData], { type: 'application/octet-stream' });
        } catch (error) {
            console.error("Decryption error:", error);
            throw new Error("Failed to decrypt image: " + error.message);
        }
    };
    
    const viewImage = async (file) => {
      try {
          if (activeTab === 'received' && file.status !== 'viewed' && file.status !== 'downloaded') {
            console.log("Updating image status to 'viewed'...");
              const statusResponse = await fetch('/api/updateImageStatus', {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      imageId: file._id,
                      status: 'viewed'
                  }),
              });

              if (statusResponse.ok) {
                  setreceivedImages(prev => prev.map(f => 
                      f._id === file._id ? { ...f, status: 'viewed' } : f
                  ));
              }
          }

          setLoading(true);
          setCurrentFile(file);
          
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${file.hash}`);
          if (!response.ok) {
              throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
          }

          const encryptedData = await response.arrayBuffer();
          const decryptedBlob = await decryptImage(encryptedData, file.iv);
          
          // Determine file type
          const fileName = file.name || "file";
          let type = 'image';
          if (fileName.endsWith(".pdf")) {
              type = 'pdf';
          } else if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
              type = 'image';
          }
          
          const url = URL.createObjectURL(decryptedBlob);
          
          setFileType(type);
          setFileUrl(url);
          setViewerOpen(true);
          
      } catch (error) {
          console.error("Error viewing file:", error);
          alert("Failed to view file: " + error.message);
      } finally {
          setLoading(false);
      }
    };
    
    const downloadFile = () => {
        if (!currentFile || !fileUrl) return;
        
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = currentFile.name || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Update status to downloaded if it's a received image
        if (activeTab === 'received' && currentFile.status !== 'downloaded') {
            updateImageStatus(currentFile._id, 'downloaded');
        }
    };
    
    const updateImageStatus = async (imageId, status) => {
        try {
            const response = await fetch('/api/updateImageStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageId,
                    status
                }),
            });

            if (response.ok) {
                setreceivedImages(prev => prev.map(f => 
                    f._id === imageId ? { ...f, status } : f
                ));
            }
        } catch (error) {
            console.error("Error updating image status:", error);
        }
    };
    
    const closeViewer = () => {
        setViewerOpen(false);
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
            setFileUrl('');
        }
        setCurrentFile(null);
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const SearchComponent = () => (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium text-gray-700 mb-2">Search Images</h3>
      <div className="flex flex-col sm:flex-row gap-2">
          <select 
              value={searchAttribute}
              onChange={(e) => setSearchAttribute(e.target.value)}
              className="flex-1 sm:flex-initial text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
              <option value="patientName">Patient Name</option>
              <option value="patientAge">Patient Age</option>
              <option value="patientGender">Patient Gender</option>
              <option value="patientDisease">Disease</option>
              <option value="fileName">File Name</option>
              {activeTab === 'sharedByMe' && <option value="receiverName">Receiver Name</option>}
          </select>
          <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
              onClick={() => setSearchTerm('')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
              Clear
          </button>
      </div>
    </div>
    );

    return (
      <div className="min-h-screen bg-gray-100 p-4" 
      style={{ 
        backgroundImage: "url('/mainbackground.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Medical Images Portal
          </h1>
          
          {status === "loading" ? (
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-700">Loading session...</p>
            </div>
          ) : status === "authenticated" ? (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">
                Logged in as:{" "}
                <span className="font-semibold">{session.user.email}</span>
              </p>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">
                Not logged in. Please sign in to continue.
              </p>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "shared"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("shared")}
            >
              Share Images
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "received"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("received")}
            >
              Received Images{" "}
              {receivedImages.length > 0 && `(${receivedImages.length})`}
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "sharedByMe"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("sharedByMe")}
            >
              Shared by Me{" "}
              {sharedByMeImages.length > 0 && `(${sharedByMeImages.length})`}
            </button>
          </div>

          {activeTab === "shared" ? (
            <>
              {uploadHistory.length > 0 && <SearchComponent />}

              <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
  {/* Receiver Email Section */}
  <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Share With Receiver
    </h2>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Receiver's Email Address
        </label>
        <input
          type="email"
          id="receiverEmail"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="name@example.com"
        />
      </div>
      <div className="flex items-end">
        <button
          onClick={getReceiverId}
          disabled={loading || !receiverEmail}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Find Receiver
            </>
          )}
        </button>
      </div>
    </div>
    
    {receiverUsername && (
      <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-r-lg flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-green-800 font-medium">Receiver verified</p>
          <p className="text-green-700">Username: <span className="font-semibold">{receiverUsername}</span></p>
        </div>
      </div>
    )}
  </div>

  {/* Image Selection Section */}
  <div className="mb-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Select Images to Share
        {searchTerm && (
          <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {filteredUploadHistory.length} matches
          </span>
        )}
      </h2>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
        />
      </div>
    </div>

    {loading ? (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading your images...</p>
      </div>
    ) : filteredUploadHistory.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUploadHistory.map((image) => (
          <div
            key={image._id}
            className={`relative overflow-hidden rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
              selectedImages.some((i) => i._id === image._id)
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-100 hover:border-gray-200"
            } shadow-sm hover:shadow-md`}
            onClick={() => toggleImageSelection(image)}
          >
            <div className="absolute top-3 right-3 z-10">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                selectedImages.some((i) => i._id === image._id)
                  ? "bg-blue-500"
                  : "bg-white border border-gray-300"
              }`}>
                {selectedImages.some((i) => i._id === image._id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <p className="font-medium text-gray-800 truncate">
                {image.fileName}
              </p>
            </div>

            <div className="p-5">
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Patient:</span>
                  <span className="font-medium text-gray-800">{image.patientName}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Age:</span>
                  <span className="font-medium text-gray-800">{image.patientAge}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Gender:</span>
                  <span className="font-medium text-gray-800">{image.patientGender}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 flex-shrink-0">Condition:</span>
                  <span className="font-medium text-gray-800">{image.patientDisease || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : uploadHistory.length > 0 && searchTerm ? (
      <div className="text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-1">No matching images</h3>
        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    ) : (
      <div className="text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-1">No images available</h3>
        <p className="text-gray-500">Upload some images to get started.</p>
      </div>
    )}
  </div>

  {/* Share Button */}
  {uploadHistory.length > 0 && (
    <div className="mt-8">
      <button
        onClick={shareSelectedImages}
        disabled={loading || selectedImages.length === 0 || !receiverId}
        className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all ${
          loading || selectedImages.length === 0 || !receiverId
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
        } flex items-center justify-center`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sharing {selectedImages.length} images...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share {selectedImages.length > 0 ? `${selectedImages.length} Selected Images` : "Images"}
          </>
        )}
      </button>
    </div>
  )}
</div>
            </>
          ) : activeTab === "received" ? (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Images Shared With You
              </h2>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : receivedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receivedImages.map((image) => (
                    <div
                      key={image._id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                        <p className="font-medium text-gray-800 truncate">
                          {image.fileName}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            image.status === "shared"
                              ? "bg-blue-100 text-blue-700"
                              : image.status === "viewed"
                              ? "bg-green-100 text-green-700"
                              : image.status === "downloaded"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {image.status.charAt(0).toUpperCase() +
                            image.status.slice(1)}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="text-gray-500">Sender:</div>
                          <div className="font-medium text-gray-700">
                            {image.senderName}
                          </div>

                          <div className="text-gray-500">Patient:</div>
                          <div className="font-medium text-gray-700">
                            {image.patientName}
                          </div>

                          <div className="text-gray-500">Age/Gender:</div>
                          <div className="font-medium text-gray-700">
                            {image.patientAge} / {image.patientGender}
                          </div>

                          <div className="text-gray-500">Disease:</div>
                          <div className="font-medium text-gray-700">
                            {image.patientDisease || "None"}
                          </div>

                          <div className="text-gray-500">Shared:</div>
                          <div className="font-medium text-gray-700">
                            {formatDate(image.sharedAt)}
                          </div>
                        </div>

                        {image.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-100">
                            <p className="text-xs text-gray-500 mb-1">Notes:</p>
                            <p className="text-sm text-gray-700">
                              {image.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => viewImage(image)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                          >
                            View Image
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    No shared images found. When someone shares medical images
                    with you, they will appear here.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Images You've Shared
              </h2>

              {sharedByMeImages.length > 0 && <SearchComponent />}

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredSharedByMeImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSharedByMeImages.map((image) => (
                    <div
                      key={image._id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                        <p className="font-medium text-gray-800 truncate">
                          {image.fileName}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            image.status === "shared"
                              ? "bg-blue-100 text-blue-700"
                              : image.status === "viewed"
                              ? "bg-green-100 text-green-700"
                              : image.status === "downloaded"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {image.status.charAt(0).toUpperCase() +
                            image.status.slice(1)}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="text-gray-500">Shared with:</div>
                          <div className="font-medium text-gray-700">
                            {image.receiverName}
                          </div>

                          <div className="text-gray-500">Patient:</div>
                          <div className="font-medium text-gray-700">
                            {image.patientName}
                          </div>

                          <div className="text-gray-500">Age/Gender:</div>
                          <div className="font-medium text-gray-700">
                            {image.patientAge} / {image.patientGender}
                          </div>

                          <div className="text-gray-500">Disease:</div>
                          <div className="font-medium text-gray-700">
                            {image.patientDisease || "None"}
                          </div>

                          <div className="text-gray-500">Shared on:</div>
                          <div className="font-medium text-gray-700">
                            {formatDate(image.sharedAt)}
                          </div>

                          <div className="text-gray-500">Status:</div>
                          <div className="font-medium text-gray-700">
                            {image.status === "shared"
                              ? "Not viewed yet"
                              : image.status === "viewed"
                              ? "Viewed by recipient"
                              : image.status === "downloaded"
                              ? "Downloaded by recipient"
                              : "Unknown status"}
                          </div>
                        </div>

                        {image.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-100">
                            <p className="text-xs text-gray-500 mb-1">
                              Your notes:
                            </p>
                            <p className="text-sm text-gray-700">
                              {image.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex justify-between">
                          <button
                            onClick={() => viewImage(image)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                          >
                            View
                          </button>

                          <button
                          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm'
                            onClick={async () => {
                              if (
                                confirm(
                                  "Do you want to revoke access to this image?"
                                )
                              ) {
                                try {
                                  const response = await fetch(
                                    "/api/revokeImageAccess",
                                    {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        imageId: image._id,
                                      }),
                                    }
                                  );

                                  if (response.ok) {
                                    alert("Access revoked successfully");
                                    if (userData) {
                                      fetchSharedByMeImages(userData);
                                    }
                                  } else {
                                    const data = await response.json();
                                    throw new Error(data.message);
                                  }
                                } catch (error) {
                                  alert(
                                    "Failed to revoke access: " + error.message
                                  );
                                }
                              }
                            }}
                          >
                            Revoke Access
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    You haven't shared any images yet. Use the "Share Images"
                    tab to share images with others.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* File Viewer Modal */}
        {viewerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-medium">
                  {currentFile?.fileName || 'File Viewer'}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={downloadFile}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Download
                  </button>
                  <button 
                    onClick={closeViewer}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {fileType === 'pdf' ? (
                  <div className="h-[70vh]">
                    <iframe 
                      src={fileUrl} 
                      className="w-full h-full border"
                      title="PDF Viewer"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <img 
                      src={fileUrl} 
                      alt={currentFile?.fileName || 'Medical Image'}
                      className="max-w-full max-h-[70vh] object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/image-error.png';
                      }}
                    />
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">File Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Patient:</div>
                    <div>{currentFile?.patientName || 'N/A'}</div>
                    
                    <div className="text-gray-500">Age/Gender:</div>
                    <div>{currentFile?.patientAge || 'N/A'} / {currentFile?.patientGender || 'N/A'}</div>
                    
                    <div className="text-gray-500">Disease:</div>
                    <div>{currentFile?.patientDisease || 'None'}</div>
                    
                    {currentFile?.notes && (
                      <>
                        <div className="text-gray-500">Notes:</div>
                        <div>{currentFile.notes}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Page;