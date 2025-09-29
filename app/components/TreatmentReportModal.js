import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Stethoscope, 
  FileText, 
  Pill, 
  Heart, 
  Activity, 
  Thermometer, 
  Weight,
  Eye,
  User,
  Download,
  Printer,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const TreatmentReportModal = ({ isOpen, onClose, treatment, patient }) => {
  if (!isOpen || !treatment || !patient) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text report for download
    const reportContent = `
TREATMENT REPORT
================

Patient: ${patient.name}
Date: ${formatDate(treatment.date)}
Time: ${formatTime(treatment.date)}
Doctor: ${treatment.doctor}

TREATMENT DETAILS
=================
Treatment: ${treatment.treatment || 'N/A'}
Diagnosis: ${treatment.diagnosis || 'N/A'}
Notes: ${treatment.notes || 'N/A'}

VITAL SIGNS
===========
Blood Pressure: ${treatment.vitalSigns?.bloodPressure?.systolic && treatment.vitalSigns?.bloodPressure?.diastolic 
  ? `${treatment.vitalSigns.bloodPressure.systolic}/${treatment.vitalSigns.bloodPressure.diastolic}` 
  : 'N/A'}
Heart Rate: ${treatment.vitalSigns?.heartRate?.value ? `${treatment.vitalSigns.heartRate.value} bpm` : 'N/A'}
Temperature: ${treatment.vitalSigns?.temperature?.value ? `${treatment.vitalSigns.temperature.value}°F` : 'N/A'}
Weight: ${treatment.vitalSigns?.weight?.value ? `${treatment.vitalSigns.weight.value} lbs` : 'N/A'}
Oxygen Saturation: ${treatment.vitalSigns?.oxygenSaturation?.value ? `${treatment.vitalSigns.oxygenSaturation.value}%` : 'N/A'}

MEDICATIONS
===========
${treatment.medications?.length > 0 
  ? treatment.medications.map(med => 
      `• ${med.name} - ${med.dosage} ${med.frequency} for ${med.duration}\n  Instructions: ${med.instructions}`
    ).join('\n\n')
  : 'No medications prescribed'
}

LAB RESULTS
===========
Cholesterol Total: ${treatment.labResults?.cholesterol?.total ? `${treatment.labResults.cholesterol.total} mg/dL` : 'N/A'}
Glucose (Fasting): ${treatment.labResults?.glucose?.fasting ? `${treatment.labResults.glucose.fasting} mg/dL` : 'N/A'}
HbA1c: ${treatment.labResults?.hba1c?.value ? `${treatment.labResults.hba1c.value}%` : 'N/A'}

${treatment.labResults?.other?.length > 0 
  ? 'Additional Lab Results:\n' + treatment.labResults.other.map(result => 
      `• ${result.testName}: ${result.value} ${result.unit} (Ref: ${result.reference})`
    ).join('\n')
  : ''
}

FOLLOW-UP
=========
Follow-up Date: ${treatment.followUpDate ? formatDate(treatment.followUpDate) : 'N/A'}
Follow-up Notes: ${treatment.followUpNotes || 'N/A'}

Report Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treatment-report-${patient.name.replace(/\s+/g, '-')}-${formatDate(treatment.date)}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Treatment Report</h2>
                <p className="text-indigo-100 text-sm">
                  {patient.name} • {formatDate(treatment.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                title="Print Report"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                title="Download Report"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                title="Close Report"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 space-y-6">
          {/* Patient & Appointment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Patient & Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Patient Name</p>
                <p className="font-semibold text-gray-900">{patient.name}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Age & Gender</p>
                <p className="font-semibold text-gray-900">{patient.age}y, {patient.gender}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">{formatDate(treatment.date)}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">{formatTime(treatment.date)}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-semibold text-gray-900">{treatment.doctor}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Appointment ID</p>
                <p className="font-semibold text-gray-900 font-mono text-xs">{treatment.appointmentId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Treatment Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-green-600" />
              Treatment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Treatment Provided</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                  {treatment.treatment || 'No treatment details recorded'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                  {treatment.diagnosis || 'No diagnosis recorded'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded border min-h-[80px]">
                {treatment.notes || 'No additional notes'}
              </p>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Blood Pressure</p>
                    <p className="text-2xl font-bold text-red-900">
                      {treatment.vitalSigns?.bloodPressure?.systolic && treatment.vitalSigns?.bloodPressure?.diastolic 
                        ? `${treatment.vitalSigns.bloodPressure.systolic}/${treatment.vitalSigns.bloodPressure.diastolic}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Heart Rate</p>
                    <p className="text-2xl font-bold text-green-900">
                      {treatment.vitalSigns?.heartRate?.value ? `${treatment.vitalSigns.heartRate.value} bpm` : 'N/A'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Temperature</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {treatment.vitalSigns?.temperature?.value ? `${treatment.vitalSigns.temperature.value}°F` : 'N/A'}
                    </p>
                  </div>
                  <Thermometer className="h-8 w-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Weight</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {treatment.vitalSigns?.weight?.value ? `${treatment.vitalSigns.weight.value} lbs` : 'N/A'}
                    </p>
                  </div>
                  <Weight className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Oxygen Saturation</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {treatment.vitalSigns?.oxygenSaturation?.value ? `${treatment.vitalSigns.oxygenSaturation.value}%` : 'N/A'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Medications */}
          {treatment.medications && treatment.medications.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-500" />
                Medications Prescribed
              </h3>
              <div className="space-y-3">
                {treatment.medications.map((med, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">{med.name}</h4>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-blue-600 font-medium">Dosage:</span>
                            <p className="text-gray-700">{med.dosage || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Frequency:</span>
                            <p className="text-gray-700">{med.frequency || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Duration:</span>
                            <p className="text-gray-700">{med.duration || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Instructions:</span>
                            <p className="text-gray-700">{med.instructions || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Results */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Lab Results
            </h3>
            
            {/* Standard Lab Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">Cholesterol Total</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {treatment.labResults?.cholesterol?.total ? `${treatment.labResults.cholesterol.total} mg/dL` : 'N/A'}
                </p>
                {treatment.labResults?.cholesterol?.total && (
                  <p className={`text-sm mt-1 ${treatment.labResults.cholesterol.total > 200 ? 'text-red-600' : 'text-green-600'}`}>
                    {treatment.labResults.cholesterol.total > 200 ? 'Above normal' : 'Normal'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">Glucose (Fasting)</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {treatment.labResults?.glucose?.fasting ? `${treatment.labResults.glucose.fasting} mg/dL` : 'N/A'}
                </p>
                {treatment.labResults?.glucose?.fasting && (
                  <p className={`text-sm mt-1 ${treatment.labResults.glucose.fasting > 100 ? 'text-red-600' : 'text-green-600'}`}>
                    {treatment.labResults.glucose.fasting > 100 ? 'Elevated' : 'Normal'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">HbA1c</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {treatment.labResults?.hba1c?.value ? `${treatment.labResults.hba1c.value}%` : 'N/A'}
                </p>
                {treatment.labResults?.hba1c?.value && (
                  <p className={`text-sm mt-1 ${treatment.labResults.hba1c.value > 6.5 ? 'text-red-600' : 'text-green-600'}`}>
                    {treatment.labResults.hba1c.value > 6.5 ? 'Poor control' : 'Good control'}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Lab Results */}
            {treatment.labResults?.other && treatment.labResults.other.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Additional Lab Results</h4>
                <div className="space-y-2">
                  {treatment.labResults.other.map((result, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-green-900">{result.testName}</h5>
                          <p className="text-green-700">
                            Value: {result.value} {result.unit}
                            {result.reference && <span className="ml-2 text-sm">(Ref: {result.reference})</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Follow-up */}
          {(treatment.followUpDate || treatment.followUpNotes) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                Follow-up Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Follow-up Date</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                    {treatment.followUpDate ? formatDate(treatment.followUpDate) : 'Not scheduled'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Follow-up Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                    {treatment.followUpNotes || 'No follow-up notes'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Report Footer */}
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This is a confidential medical report. Please handle with appropriate care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentReportModal;
