import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { fetchUser, fetchUploads } from "../actions/fetchDetails";
import { fetchHash, fetchIv, decryptImage } from "../actions/decrypt";
import CalendlyPopup from "./CalendlyPopup";
import Papa from "papaparse";
import { useRouter } from 'next/navigation';
import { MessageCircle, FileText, Send, Loader2, User, Bot, Upload, Check, AlertCircle, Stethoscope, Phone, Mail, MapPin, Star, Calendar, Award, ExternalLink } from "lucide-react";

const Chatbot = ({ useremail, onClose}) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfToParse, setPdfToParse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);

  // Local storage key for chat messages
  const CHAT_STORAGE_KEY = `chat_messages_${useremail || 'anonymous'}`;

  const [open, setOpen] = useState(false);
  function bookAppointment(email) {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  const calendlyLink = "CALENDLY_LINK"; // Replace with your event link



  // Move API key to environment variable
  const ai = new GoogleGenAI({ apiKey: "API_KEY"});

  useEffect(() => {
    fetch("/doctors.csv")
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setCsvData(result.data);
          },
        });
      })
      .catch((error) => {
        console.error("Error loading CSV data:", error);
      });
  }, []);

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const getFileId = (file, index) =>
    file.id || file._id || file.fileId || file.fileName || file.filename || file.originalName || file.file_name || file.title || file.document_name || file.uploadName || index;

  // Local storage functions for chat persistence
  const saveChatToLocalStorage = (chatMessages) => {
    try {
      if (typeof window !== 'undefined') {
        const chatData = {
          messages: chatMessages,
          timestamp: new Date().toISOString(),
          userEmail: useremail
        };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatData));
        console.log('Chat saved to local storage:', chatData);
      }
    } catch (error) {
      console.error('Error saving chat to local storage:', error);
    }
  };

  const loadChatFromLocalStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedChat) {
          const chatData = JSON.parse(savedChat);
          // Check if the saved chat is from the same user
          if (chatData.userEmail === useremail) {
            console.log('Chat loaded from local storage:', chatData);
            return chatData.messages || [];
          }
        }
      }
    } catch (error) {
      console.error('Error loading chat from local storage:', error);
    }
    return [];
  };

  const clearChatFromLocalStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        console.log('Chat cleared from local storage');
      }
    } catch (error) {
      console.error('Error clearing chat from local storage:', error);
    }
  };

  const exportChatHistory = () => {
    try {
      const chatData = {
        messages: messages,
        timestamp: new Date().toISOString(),
        userEmail: useremail,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(chatData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `chat_history_${useremail || 'anonymous'}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      console.log('Chat history exported successfully');
    } catch (error) {
      console.error('Error exporting chat history:', error);
    }
  };

  const getChatStats = () => {
    const userMessages = messages.filter(msg => msg.sender === 'user').length;
    const botMessages = messages.filter(msg => msg.sender === 'bot').length;
    const totalMessages = messages.length;
    
    return {
      userMessages,
      botMessages,
      totalMessages,
      chatDuration: messages.length > 0 ? 'Active' : 'No messages'
    };
  };

  // Custom setMessages function that automatically saves to local storage
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    saveChatToLocalStorage(newMessages);
  };

  // Function to add a single message and save to local storage
  const addMessage = (message) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    saveChatToLocalStorage(newMessages);
  };

  const getData = async () => {
    if (!useremail) {
      console.warn("No user email provided, skipping fetch");
      return;
    }

    try {
      const u = await fetchUser(useremail);
      const images = await fetchUploads(u);

      if (Array.isArray(images)) {
        setFiles([...images]);
        if (images.length > 0) {
          setSelectedFile(getFileId(images[0], 0));
        }
      } else if (images && typeof images === "object") {
        const imageArray = images.data || images.files || images.uploads || Object.values(images);
        if (Array.isArray(imageArray)) {
          setFiles([...imageArray]);
          if (imageArray.length > 0) {
            setSelectedFile(getFileId(imageArray[0], 0));
          }
        }
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFiles([]);
    }
  };

  useEffect(() => {
    if (useremail) {
      getData();
      // Load chat from local storage
      const savedMessages = loadChatFromLocalStorage();
      if (savedMessages.length > 0) {
        updateMessages(savedMessages);
        console.log('Loaded', savedMessages.length, 'messages from local storage');
      }
    }
  }, [useremail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const defaultPrompt = "Analyze this medical report and recommend the best doctors from the available database. Provide a comprehensive analysis including medical findings, doctor recommendations with match scores, urgency assessment, and next steps.";

    addMessage({ sender: "user", text: "Please analyze my medical report and recommend doctors." });

    try {
      setIsLoading(true);
      
      const fileHash = await fetchHash(selectedFile);
      const fileiv = await fetchIv(selectedFile);
      
      if (!fileHash || !fileiv) {
        throw new Error("Failed to fetch decryption parameters");
      }

      const pdfFile = await decryptImage(fileHash, fileiv, "application/pdf");
      setPdfToParse(pdfFile);
      
      if (!pdfFile || pdfFile.size === 0) {
        throw new Error("Decrypted file is empty or invalid");
      }
      
      const pdfFileForApi = new File([pdfFile], "decrypted_document.pdf", { type: "application/pdf" });
      const base64Data = await fileToBase64(pdfFileForApi);
      
      if (!base64Data || base64Data.length < 100) {
        throw new Error("Base64 conversion failed or data too short");
      }

      // Prepare CSV data as text for Gemini
      const csvText = csvData.map(row => 
        Object.values(row).join(', ')
      ).join('\n');
      
      // Create comprehensive prompt with CSV data and user question
      const comprehensivePrompt = `Based on the following information, please provide a detailed analysis and recommendations:

MEDICAL REPORT (PDF):
[The user has uploaded a medical report in PDF format]

AVAILABLE DOCTORS DATABASE:
${csvText}

USER QUESTION:
${defaultPrompt}

Please analyze the medical report and provide:
1. A comprehensive analysis of the medical findings
2. Three specific doctor recommendations from the available database based on the medical condition and send their full details
3. Match scores and reasoning for each recommended doctor
4. Urgency level assessment
5. Next steps and actionable advice

Format your response in a clear, structured manner with proper sections and bullet points.`;

      const contents = [
        {
          role: "user",
          parts: [
            { text: comprehensivePrompt },
            { 
              inlineData: {
                mimeType: "application/pdf",
                data: base64Data
              }
            }
          ]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });

      console.log(response);

      let responseText = "";
      
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = response.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Could not extract text from Gemini response");
      }
      
      addMessage({ sender: "bot", text: responseText });
      
    } catch (error) {
      console.error("Error processing request:", error);
      addMessage({ sender: "bot", text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileName = (file) => {
    return file.fileName || file.filename || file.originalName || file.file_name || file.title || file.document_name || file.uploadName || 'Unknown Document';
  };

  // Function to extract doctor recommendations from the AI response
  const extractDoctorRecommendations = (text) => {
    const doctorSections = text.split(/(?=Doctor\s+\d+|Dr\.|Recommended\s+Doctor)/i);
    const doctors = [];
    
    doctorSections.forEach(section => {
      if (section.trim().length < 50) return; // Skip small sections
      
      const doctor = {
        name: extractValue(section, /(?:Doctor\s+\d+[:]?|Dr\.|Recommended\s+Doctor[:]?)\s*([^\n]+)/i),
        specialty: extractValue(section, /(?:Special(?:ty|ization)|Expertise)[:]?\s*([^\n]+)/i),
        experience: extractValue(section, /(?:Experience|Years)[:]?\s*([^\n]+)/i),
        rating: extractValue(section, /(?:Rating|Score)[:]?\s*([^\n]+)/i),
        matchScore: extractValue(section, /(?:Match\s+Score|Match)[:]?\s*([^\n]+)/i),
        location: extractValue(section, /(?:Location|Clinic|Hospital)[:]?\s*([^\n]+)/i),
        contact: extractValue(section, /(?:Contact|Phone)[:]?\s*([^\n]+)/i),
        email: extractValue(section, /(?:Email)[:]?\s*([^\n]+)/i),
        reason: extractValue(section, /(?:Reason|Why)[:]?\s*([^\n]+(?:\n(?!\s*(?:Doctor|Dr\.|Recommended))[^\n]*)*)/i),
      };
      
      // Only add if we have at least a name and specialty
      if (doctor.name && doctor.specialty) {
        doctors.push(doctor);
      }
    });
    
    return doctors.length > 0 ? doctors : null;
  };
  
  // Helper function to extract values using regex
  const extractValue = (text, regex) => {
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const renderMessage = (message) => {
    if (message.sender === "user") {
      return <div className="text-sm">{message.text}</div>;
    }

    // Extract doctor recommendations
    const doctors = extractDoctorRecommendations(message.text);
    
    // Enhanced formatting for bot messages
    const formatBotMessage = (text) => {
      // Remove doctor sections to avoid duplication
      const textWithoutDoctors = text.replace(/(?:Doctor\s+\d+|Dr\.|Recommended\s+Doctor)[\s\S]*?(?=(?:Doctor\s+\d+|Dr\.|Recommended\s+Doctor|$))/gi, '');
      
      // Split into sections
      const sections = textWithoutDoctors.split(/(?=^[A-Z][A-Z\s&]+:)/m);
      
      return (
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => {
            if (!section.trim()) return null;

            const lines = section.split("\n").filter((line) => line.trim());
            if (lines.length === 0) return null;

            const title = lines[0].replace(":", "");
            const content = lines.slice(1);

            return (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center">
                  {title === "MEDICAL ANALYSIS" && "🔬 Medical Analysis"}
                  {title === "DOCTOR RECOMMENDATIONS" &&
                    "👨‍⚕️ Doctor Recommendations"}
                  {title === "URGENCY ASSESSMENT" && "⚠️ Urgency Assessment"}
                  {title === "NEXT STEPS" && "🚀 Next Steps"}
                  {title === "SUMMARY" && "📋 Summary"}
                  {title === "RECOMMENDED ACTIONS" && "✅ Recommended Actions"}
                  {![
                    "MEDICAL ANALYSIS",
                    "DOCTOR RECOMMENDATIONS",
                    "URGENCY ASSESSMENT",
                    "NEXT STEPS",
                    "SUMMARY",
                    "RECOMMENDED ACTIONS",
                  ].includes(title) && title}
                </h3>

                <div className="space-y-3">
                  {content.map((line, lineIndex) => {
                    const trimmedLine = line.trim();

                    if (
                      trimmedLine.startsWith("•") ||
                      trimmedLine.startsWith("-")
                    ) {
                      return (
                        <div
                          key={lineIndex}
                          className="flex items-start space-x-3 pl-4"
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="flex-1 text-gray-700">
                            {trimmedLine.slice(1).trim()}
                          </span>
                        </div>
                      );
                    } else if (trimmedLine.match(/^\d+\./)) {
                      return (
                        <div
                          key={lineIndex}
                          className="flex items-start space-x-3 pl-4"
                        >
                          <span className="text-blue-500 font-semibold mt-1 min-w-[20px]">
                            {trimmedLine.match(/^\d+\./)[0]}
                          </span>
                          <span className="flex-1 text-gray-700">
                            {trimmedLine.replace(/^\d+\.\s*/, "")}
                          </span>
                        </div>
                      );
                    } else if (
                      trimmedLine.includes("**") &&
                      trimmedLine.includes(":")
                    ) {
                      // Handle bold labels like "**Name:** Dr. Smith"
                      const parts = trimmedLine.split(/(\*\*[^*]+\*\*:)/);
                      return (
                        <div
                          key={lineIndex}
                          className="flex items-start space-x-2"
                        >
                          <span className="font-semibold text-gray-800">
                            {parts[1]}
                          </span>
                          <span className="text-gray-700">
                            {parts.slice(2).join("")}
                          </span>
                        </div>
                      );
                    } else if (trimmedLine.includes("**")) {
                      // Handle other bold text
                      const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/);
                      return (
                        <div key={lineIndex} className="text-gray-700">
                          {parts.map((part, partIndex) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong
                                  key={partIndex}
                                  className="font-semibold text-gray-800"
                                >
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </div>
                      );
                    } else if (trimmedLine === "") {
                      return <div key={lineIndex} className="h-2"></div>;
                    } else {
                      return (
                        <div
                          key={lineIndex}
                          className="text-gray-700 leading-relaxed"
                        >
                          {trimmedLine}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}

          {/* Doctor Recommendations Grid */}
          {doctors && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Recommended Specialists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">
                          {doctor.name}
                        </h4>
                        <p className="text-blue-600 font-medium">
                          {doctor.specialty}
                        </p>
                      </div>
                      {doctor.matchScore && (
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Match: {doctor.matchScore}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {doctor.experience && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{doctor.experience}</span>
                        </div>
                      )}

                      {doctor.rating && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          <span>{doctor.rating}</span>
                        </div>
                      )}

                      {doctor.location && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{doctor.location}</span>
                        </div>
                      )}

                      {doctor.contact && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-green-500" />
                          <span>{doctor.contact}</span>
                        </div>
                      )}

                      {doctor.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-purple-500" />
                          <span>{doctor.email}</span>
                        </div>
                      )}
                    </div>

                    {doctor.reason && (
                      <div className="mt-4 pt-4 border-t border-blue-100">
                        <p className="text-sm text-gray-700 italic">
                          "{doctor.reason}"
                        </p>
                      </div>
                    )}

                    <button
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                      onClick={() => bookAppointment(doctor.email)}
                    >
                      <span>Book Appointment</span>
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </button>
                    <CalendlyPopup
                      url={calendlyLink}
                      email={doctor.email}
                      open={open}
                      onClose={handleClose}
                    />
                    <button
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                      onClick={() => copyEmail(doctor.email)}
                    >
                      <span>Copy Email</span>
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    return formatBotMessage(message.text);
  };

// Copy email function
const copyEmail = async (email) => {
  try {
    await navigator.clipboard.writeText(email);
    // Optional: Show success message
    console.log('Email copied to clipboard:', email);
    router.push('/shared');
    // You could also show a toast notification here
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = email;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    console.log('Email copied to clipboard (fallback):', email);
  }
};


  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedChat AI</h1>
                <p className="text-sm text-gray-500">Medical Document Assistant</p>
              </div>
            </div>
            
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Your Documents</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {files.length}
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No documents uploaded yet</p>
                </div>
              ) : (
                files.map((file, index) => {
                  const fileId = getFileId(file, index);
                  const fileName = getFileName(file);
                  const isSelected = selectedFile === fileId;
                  
                  return (
                    <div
                      key={fileId}
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedFile(fileId)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? "bg-white/20" : "bg-blue-100"
                        }`}>
                          <FileText className={`h-4 w-4 ${
                            isSelected ? "text-white" : "text-blue-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}>
                            {fileName}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isSelected ? "text-blue-100" : "text-gray-500"
                          }`}>
                            PDF Document
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-800 font-medium">Ready to chat</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Selected: {getFileName(files.find((f, idx) => getFileId(f, idx) === selectedFile) || {})}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Chat Assistant</h3>
                <p className="text-sm text-gray-500">
                  {selectedFile ? `Analyzing: ${getFileName(files.find((f, idx) => getFileId(f, idx) === selectedFile) || {})}` : "Select a document to begin"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Close Chatbot"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                {!selectedFile ? (
                  <>
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Document</h3>
                    <p className="text-gray-500">
                      Choose a medical document from the sidebar to start analyzing and get AI-powered insights.
                    </p>
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Analysis</h3>
                    <p className="text-gray-500 mb-4">
                      Ask questions about your medical document. I can help you understand diagnoses, treatments, and recommend specialists.
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-left">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">💡 "What does this report mean?"</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">🩺 "Which specialists should I see?"</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700">📋 "Explain my test results"</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Chat Statistics */}
              {messages.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Chat Statistics</span>
                    </div>
                    <div className="flex space-x-4 text-xs text-blue-700">
                      <span>📤 {getChatStats().userMessages} user messages</span>
                      <span>🤖 {getChatStats().botMessages} AI responses</span>
                      <span>📊 {getChatStats().totalMessages} total</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Control Buttons */}
              {messages.length > 0 && (
                <div className="flex justify-end mb-4 space-x-3">
                  <button
                    onClick={exportChatHistory}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Export Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      updateMessages([]);
                      clearChatFromLocalStorage();
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Clear Chat</span>
                  </button>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                      : "bg-gradient-to-r from-green-500 to-teal-600"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  <div className={`flex-1 max-w-3xl ${
                    message.sender === "user" ? "text-right" : ""
                  }`}>
                    <div className={`inline-block px-6 py-4 rounded-2xl shadow-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}>
                      <div className={`text-sm ${
                        message.sender === "user" ? "text-white" : "text-gray-900"
                      }`}>
                        {message.sender === "user" ? message.text : renderMessage(message)}
                      </div>
                    </div>
                    
                    <div className={`text-xs text-gray-400 mt-2 ${
                      message.sender === "user" ? "text-right" : ""
                    }`}>
                      {message.sender === "user" ? "You" : "AI Assistant"} • just now
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      <span className="text-gray-600 text-sm">Analyzing your document...</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 px-6 py-4 shadow-lg">
          {selectedFile && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Chatting about: {getFileName(files.find((f, idx) => getFileId(f, idx) === selectedFile) || {})}
                </span>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {selectedFile && !isLoading && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing Document...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-5 w-5" />
                      <span>Analyze Medical Report & Get Doctor Recommendations</span>
                    </div>
                  )}
                </button>
                
                <p className="text-sm text-gray-500 mt-3">
                  Click to get AI-powered analysis of your medical report and personalized doctor recommendations
                </p>
              </div>
            )}

            {!selectedFile && (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Document First</h3>
                <p className="text-gray-500">
                  Choose a medical document from the sidebar to start the AI analysis
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Document</h3>
                <p className="text-gray-500">
                  Please wait while AI processes your medical report and finds the best doctor matches...
                </p>
                <div className="flex space-x-2 justify-center mt-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
