import React, { useState, useEffect, useRef } from "react";
import {
  Stethoscope,
  Users,
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  Heart,
  Brain,
  Eye,
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Target,
  Zap,
  Database,
  UserCheck,
  ClipboardList,
  MessageSquare,
  Bell,
  Settings,
  X,
  UserPlus,
  Plus,
} from "lucide-react";
import PatientManager from "./PatientManager";
import AppointmentModal from "./AppointmentModal";
import TreatmentReportModal from "./TreatmentReportModal";

const DoctorAnalyzer = ({ useremail, onClose }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [timeRange, setTimeRange] = useState("30days");
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    trends: true,
    alerts: true,
    recommendations: true,
  });

  const [dimensions, setDimensions] = useState({ width: 1400, height: 900 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [showPatientManager, setShowPatientManager] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTreatmentReport, setShowTreatmentReport] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const containerRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startDimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    fetchPatients();
    fetchAnalytics();
  }, [useremail]);

  // Map database patient to frontend format
  const mapPatientToFrontend = (dbPatient) => {
    return {
      id: dbPatient._id || dbPatient.patientId,
      name: `${dbPatient.firstName} ${dbPatient.lastName}`,
      age: dbPatient.age || calculateAge(dbPatient.dateOfBirth),
      gender: dbPatient.gender,
      condition: dbPatient.primaryCondition,
      lastVisit: dbPatient.lastVisit,
      riskLevel: dbPatient.riskLevel,
      medications: dbPatient.medications
        ? dbPatient.medications.map((med) => med.name)
        : [],
      vitalSigns: {
        bloodPressure: dbPatient.vitalSigns?.bloodPressure
          ? {
              systolic: dbPatient.vitalSigns.bloodPressure.systolic,
              diastolic: dbPatient.vitalSigns.bloodPressure.diastolic,
            }
          : null,
        heartRate: dbPatient.vitalSigns?.heartRate
          ? {
              value: dbPatient.vitalSigns.heartRate.value,
            }
          : null,
        temperature: dbPatient.vitalSigns?.temperature
          ? {
              value: dbPatient.vitalSigns.temperature.value,
            }
          : null,
        weight: dbPatient.vitalSigns?.weight
          ? {
              value: dbPatient.vitalSigns.weight.value,
            }
          : null,
      },
      labResults: {
        cholesterol: dbPatient.labResults?.cholesterol
          ? {
              total: dbPatient.labResults.cholesterol.total,
            }
          : null,
        glucose: dbPatient.labResults?.glucose
          ? {
              fasting: dbPatient.labResults.glucose.fasting,
            }
          : null,
        hba1c: dbPatient.labResults?.hba1c
          ? {
              value: dbPatient.labResults.hba1c.value,
            }
          : null,
      },
      symptoms: dbPatient.currentSymptoms
        ? dbPatient.currentSymptoms.map((symptom) => symptom.symptom)
        : [],
      treatmentHistory: dbPatient.treatmentHistory
        ? dbPatient.treatmentHistory.map((treatment) => ({
            date: treatment.date,
            treatment: treatment.treatment,
            doctor: treatment.doctor,
            notes: treatment.notes,
          }))
        : [],
    };
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // In fetchPatients function:
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/patients?doctorEmail=${useremail}&limit=50`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched patients:", data);

        setPatients(data.patients || []);

        // If no patients, generate mock analysis data
        if (data.patients.length === 0) {
          generateMockAnalysisData(data.patients);
        }
      } else {
        console.error("Failed to fetch patients");
        setPatients([]);
        generateMockAnalysisData([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
      generateMockAnalysisData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // In fetchAnalytics function:
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/patients/analytics?timeRange=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.analytics);
      } else {
        console.error("Failed to fetch analytics");
        // Fallback to generated analysis data based on patients
        generateMockAnalysisData(patients);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Fallback to generated analysis data based on patients
      generateMockAnalysisData(patients);
    }
  };

  const generateMockAnalysisData = (patientList) => {
    const analysis = {
      overview: {
        totalPatients: patientList.length,
        highRiskPatients: patientList.filter(
          (p) => p.riskLevel === "High" || p.riskLevel === "Critical"
        ).length,
        averageAge:
          patientList.length > 0
            ? Math.round(
                patientList.reduce((sum, p) => sum + p.age, 0) /
                  patientList.length
              )
            : 0,
        recentPatients: patientList.filter((p) => {
          const lastVisit = new Date(p.lastVisit);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastVisit >= thirtyDaysAgo;
        }).length,
        recentVisits: patientList.length, // Simplified for demo
      },
      riskDistribution: {
        Low: patientList.filter((p) => p.riskLevel === "Low").length,
        Medium: patientList.filter((p) => p.riskLevel === "Medium").length,
        High: patientList.filter((p) => p.riskLevel === "High").length,
        Critical: patientList.filter((p) => p.riskLevel === "Critical").length,
      },
      commonConditions: getCommonConditions(patientList),
      trends: {
        bloodPressure: "Stable",
        glucose: patientList.length > 0 ? "Monitoring" : "No data",
        cholesterol: patientList.length > 0 ? "Monitoring" : "No data",
      },
      alerts: generateAlerts(patientList),
      recommendations: generateRecommendations(patientList),
    };
    setAnalysisData(analysis);
  };

  const getCommonConditions = (patientList) => {
    const conditionCount = {};
    patientList.forEach((patient) => {
      const condition = patient.condition;
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });

    return Object.entries(conditionCount)
      .map(([condition, count]) => ({ condition, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const generateAlerts = (patientList) => {
    const alerts = [];

    if (patientList.length === 0) {
      alerts.push({
        type: "Critical",
        message: "No patients found - Add your first patient",
        patient: "System",
      });
    }

    // Add alerts for critical risk patients
    patientList
      .filter((p) => p.riskLevel === "Critical")
      .forEach((patient) => {
        alerts.push({
          type: "Critical",
          message: `${patient.name} requires immediate attention`,
          patient: patient.name,
        });
      });

    // Add alerts for high risk patients
    patientList
      .filter((p) => p.riskLevel === "High")
      .forEach((patient) => {
        alerts.push({
          type: "High",
          message: `${patient.name} needs follow-up`,
          patient: patient.name,
        });
      });

    return alerts;
  };

  const generateRecommendations = (patientList) => {
    const recommendations = [];

    if (patientList.length === 0) {
      recommendations.push({
        type: "Setup",
        message: "Start by adding patient information",
        priority: "High",
      });
    }

    // Recommendations based on patient data
    patientList.forEach((patient) => {
      if (patient.riskLevel === "Critical") {
        recommendations.push({
          type: "Urgent Care",
          message: `Schedule emergency consultation for ${patient.name}`,
          priority: "High",
        });
      }

      if (patient.labResults?.glucose?.fasting > 180) {
        recommendations.push({
          type: "Lab Results",
          message: `Review glucose levels for ${patient.name}`,
          priority: "Medium",
        });
      }

      if (patient.labResults?.cholesterol?.total > 240) {
        recommendations.push({
          type: "Lab Results",
          message: `Consider cholesterol management for ${patient.name}`,
          priority: "Medium",
        });
      }
    });

    return recommendations;
  };

  // Resize functionality (keep your existing resize code)
  const handleMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startDimensionsRef.current = { ...dimensions };
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    let newWidth = startDimensionsRef.current.width;
    let newHeight = startDimensionsRef.current.height;

    const maxWidth = window.innerWidth - 80;
    const maxHeight = window.innerHeight - 80;

    if (resizeType.includes("right")) {
      newWidth = Math.max(
        600,
        Math.min(maxWidth, startDimensionsRef.current.width + deltaX)
      );
    }
    if (resizeType.includes("left")) {
      newWidth = Math.max(
        600,
        Math.min(maxWidth, startDimensionsRef.current.width - deltaX)
      );
    }
    if (resizeType.includes("bottom")) {
      newHeight = Math.max(
        400,
        Math.min(maxHeight, startDimensionsRef.current.height + deltaY)
      );
    }
    if (resizeType.includes("top")) {
      newHeight = Math.max(
        400,
        Math.min(maxHeight, startDimensionsRef.current.height - deltaY)
      );
    }

    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeType("");
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setDimensions({ width: 1400, height: 900 });
    } else {
      const maxWidth = window.innerWidth - 80;
      const maxHeight = window.innerHeight - 80;
      setDimensions({ width: maxWidth, height: maxHeight });
    }
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = getResizeCursor();
    } else {
      document.body.style.cursor = "default";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isResizing, resizeType]);

  const getResizeCursor = () => {
    if (resizeType.includes("right") && resizeType.includes("bottom"))
      return "nw-resize";
    if (resizeType.includes("left") && resizeType.includes("bottom"))
      return "ne-resize";
    if (resizeType.includes("right") && resizeType.includes("top"))
      return "sw-resize";
    if (resizeType.includes("left") && resizeType.includes("top"))
      return "se-resize";
    if (resizeType.includes("right") || resizeType.includes("left"))
      return "ew-resize";
    if (resizeType.includes("top") || resizeType.includes("bottom"))
      return "ns-resize";
    return "default";
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePatientAdded = (newPatient) => {
    const mappedPatient = mapPatientToFrontend(newPatient);
    setPatients((prev) => [mappedPatient, ...prev]);
    fetchAnalytics(); // Refresh analytics
  };

  const handleAppointmentAdded = (result) => {
    // Refresh the patient data to show updated treatment history
    fetchPatients();
    fetchAnalytics();
    
    // Show success message
    alert('Appointment and treatment added successfully!');
  };

  const handleTreatmentClick = (treatment) => {
    setSelectedTreatment(treatment);
    setShowTreatmentReport(true);
  };

  const handleRefresh = () => {
    fetchPatients();
    fetchAnalytics();
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "text-red-600 bg-red-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "High":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "Medium":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex bg-gradient-to-br from-slate-50 via-white to-blue-50 relative shadow-2xl border border-gray-300 rounded-lg overflow-hidden select-none"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        minWidth: "600px",
        minHeight: "400px",
        resize: "none",
      }}
    >
      {/* Resize Handles */}
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/30 z-50 transition-colors duration-200"
        onMouseDown={(e) => handleMouseDown(e, "top")}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/30 z-50 transition-colors duration-200"
        onMouseDown={(e) => handleMouseDown(e, "bottom")}
      />
      <div
        className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize hover:bg-blue-400/30 z-50 transition-colors duration-200"
        onMouseDown={(e) => handleMouseDown(e, "left")}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize hover:bg-blue-400/30 z-50 transition-colors duration-200"
        onMouseDown={(e) => handleMouseDown(e, "right")}
      />

      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-blue-400/50 z-50 transition-colors duration-200 rounded-br-lg"
        onMouseDown={(e) => handleMouseDown(e, "top-left")}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize hover:bg-blue-400/50 z-50 transition-colors duration-200 rounded-bl-lg"
        onMouseDown={(e) => handleMouseDown(e, "top-right")}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize hover:bg-blue-400/50 z-50 transition-colors duration-200 rounded-tr-lg"
        onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-blue-400/50 z-50 transition-colors duration-200 rounded-tl-lg"
        onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
      />

      {isResizing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium z-50">
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 shadow-lg z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Doctor Analyzer</h1>
              <p className="text-blue-100 text-sm">
                Advanced Patient Data Analysis & Insights
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMaximize}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              title="Close Analyzer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex pt-16"
        style={{ height: `${dimensions.height - 64}px` }}
      >
        {/* Left Sidebar - Patient List */}
        <div className="w-80 bg-white/90 backdrop-blur-lg border-r border-gray-200/50 shadow-xl flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Patient List</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {patients.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowPatientManager(true)}
                  className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                  title="Add Patient"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Patients</option>
                <option value="critical">Critical Risk</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            {/* Patient Cards */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {patients
                .filter((patient) => {
                  const matchesSearch =
                    patient.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    patient.condition
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());
                  const matchesFilter =
                    filterType === "all" ||
                    patient.riskLevel.toLowerCase() === filterType;
                  return matchesSearch && matchesFilter;
                })
                .map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPatient?.id === patient.id
                        ? "bg-blue-100 border-2 border-blue-300 shadow-md"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {patient.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Age: {patient.age} • {patient.gender}
                        </p>
                      </div>
                      {/* <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                          patient.riskLevel
                        )}`}
                      >
                        {patient.riskLevel}
                      </div> */}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last visit:{" "}
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Analysis Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedPatient ? (
              <>
                {/* Patient Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                      Patient Overview: {selectedPatient.name}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowAppointmentModal(true)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Appointment
                      </button>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                          selectedPatient.riskLevel
                        )}`}
                      >
                        {selectedPatient.riskLevel} Risk
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            Age
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {selectedPatient.age}
                          </p>
                        </div>
                        <Heart className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            Gender
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {selectedPatient.gender}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">
                            Height
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            {selectedPatient.height}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-orange-500" />
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">
                            Weight
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {selectedPatient.vitalSigns?.weight?.value
                              ? `${selectedPatient.vitalSigns.weight.value} lbs`
                              : "N/A"}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lab Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedPatient.phoneNumber}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedPatient.email? selectedPatient.email : "N/A"}
                    </p>
                    
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Zip Code</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedPatient.zipCode? selectedPatient.zipCode : "N/A"}
                    </p>
                    
                  </div>
                </div>

                {/* Treatment History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2 text-indigo-600" />
                    Treatment History
                  </h3>
                  <div className="space-y-3">
                    {selectedPatient.treatmentHistory && selectedPatient.treatmentHistory.length > 0 ? (
                      selectedPatient.treatmentHistory.map((treatment, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleTreatmentClick(treatment)}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{treatment.treatment}</p>
                            <p className="text-xs text-gray-600">{treatment.doctor} • {new Date(treatment.date).toLocaleDateString()}</p>
                            {treatment.diagnosis && (
                              <p className="text-xs text-blue-600 mt-1">Diagnosis: {treatment.diagnosis}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 hover:text-blue-600 transition-colors duration-200">
                            Click to view report
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No treatment history available</p>
                        <p className="text-sm text-gray-400 mt-1">Add an appointment to create treatment records</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a Patient
                  </h3>
                  <p className="text-gray-500">
                    Choose a patient from the sidebar to view detailed analysis
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Analytics & Alerts */}
        <div className="w-80 bg-white/90 backdrop-blur-lg border-l border-gray-200/50 shadow-xl flex-shrink-0">
          <div className="p-4 space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Patients</span>
                  <span className="font-bold">
                    {analysisData?.overview?.totalPatients || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">High Risk</span>
                  <span className="font-bold text-red-200">
                    {analysisData?.overview?.highRiskPatients || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Age</span>
                  <span className="font-bold">
                    {analysisData?.overview?.averageAge || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Recent Visits</span>
                  <span className="font-bold">
                    {analysisData?.overview?.recentVisits || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-red-500" />
                  Alerts
                </h3>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {analysisData?.alerts?.length || 0}
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisData?.alerts?.length > 0 ? (
                  analysisData.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">
                          {alert.patient}
                        </p>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No alerts</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                Recommendations
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisData?.recommendations?.length > 0 ? (
                  analysisData.recommendations.map((rec, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-green-800">
                          {rec.type}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            rec.priority === "High"
                              ? "bg-red-100 text-red-600"
                              : rec.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{rec.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Target className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No recommendations</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Manager Modal */}
      <PatientManager
        isOpen={showPatientManager}
        onClose={() => setShowPatientManager(false)}
        onPatientAdded={handlePatientAdded}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        patient={selectedPatient}
        onAppointmentAdded={handleAppointmentAdded}
      />

      {/* Treatment Report Modal */}
      <TreatmentReportModal
        isOpen={showTreatmentReport}
        onClose={() => {
          setShowTreatmentReport(false);
          setSelectedTreatment(null);
        }}
        treatment={selectedTreatment}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorAnalyzer;
