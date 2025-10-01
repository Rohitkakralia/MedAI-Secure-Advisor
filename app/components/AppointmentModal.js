import React, { useState } from 'react';
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
  Plus,
  Trash2
} from 'lucide-react';

const AppointmentModal = ({ isOpen, onClose, patient, onAppointmentAdded }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'Consultation',
    notes: '',
    treatment: '',
    diagnosis: '',
    followUpDate: '',
    followUpNotes: '',
    medications: [],
    vitalSigns: {
      bloodPressure: { systolic: '', diastolic: '' },
      heartRate: { value: '' },
      temperature: { value: '' },
      weight: { value: '' },
      oxygenSaturation: { value: '' }
    },
    labResults: {
      cholesterol: { total: '', ldl: '', hdl: '' },
      glucose: { fasting: '', random: '' },
      hba1c: { value: '' },
      other: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleDeepNestedInputChange = (parentField, childField, grandChildField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: {
          ...prev[parentField][childField],
          [grandChildField]: value
        }
      }
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addLabResult = () => {
    setFormData(prev => ({
      ...prev,
      labResults: {
        ...prev.labResults,
        other: [...prev.labResults.other, { testName: '', value: '', unit: '', reference: '' }]
      }
    }));
  };

  const removeLabResult = (index) => {
    setFormData(prev => ({
      ...prev,
      labResults: {
        ...prev.labResults,
        other: prev.labResults.other.filter((_, i) => i !== index)
      }
    }));
  };

  const updateLabResult = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      labResults: {
        ...prev.labResults,
        other: prev.labResults.other.map((result, i) => 
          i === index ? { ...result, [field]: value } : result
        )
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.treatment && !formData.notes) {
      newErrors.treatment = 'Either treatment or notes is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log("formData before adding appointment", formData);   
    try {
      const response = await fetch(`/api/patients/${patient.id}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("result after adding appointment", result);
        console.log("patient", patient);
        onAppointmentAdded(result);
        onClose();
        // Reset form
        setFormData({
          date: '',
          time: '',
          type: 'Consultation',
          notes: '',
          treatment: '',
          diagnosis: '',
          followUpDate: '',
          followUpNotes: '',
          medications: [],
          vitalSigns: {
            bloodPressure: { systolic: '', diastolic: '' },
            heartRate: { value: '' },
            temperature: { value: '' },
            weight: { value: '' },
            oxygenSaturation: { value: '' }
          },
          labResults: {
            cholesterol: { total: '', ldl: '', hdl: '' },
            glucose: { fasting: '', random: '' },
            hba1c: { value: '' },
            other: []
          }
        });
      } else {
        const error = await response.json();
        console.error('Error adding appointment:', error);
        alert('Failed to add appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Appointment</h2>
                <p className="text-blue-100 text-sm">
                  Patient: {patient.name} ({patient.age}y, {patient.gender})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="h-4 w-4 inline mr-1" />
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Routine Check-up">Routine Check-up</option>
                <option value="Procedure">Procedure</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>
          </div>

          {/* Treatment & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Treatment
              </label>
              <input
                type="text"
                value={formData.treatment}
                onChange={(e) => handleInputChange('treatment', e.target.value)}
                placeholder="e.g., Prescribed medication, therapy, etc."
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.treatment ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.treatment && <p className="text-red-500 text-xs mt-1">{errors.treatment}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Eye className="h-4 w-4 inline mr-1" />
                Diagnosis
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                placeholder="Primary diagnosis"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Detailed notes about the appointment..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Vital Signs */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    value={formData.vitalSigns.bloodPressure.systolic}
                    onChange={(e) => handleDeepNestedInputChange('vitalSigns', 'bloodPressure', 'systolic', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="flex items-center text-gray-500">/</span>
                  <input
                    type="number"
                    placeholder="Diastolic"
                    value={formData.vitalSigns.bloodPressure.diastolic}
                    onChange={(e) => handleDeepNestedInputChange('vitalSigns', 'bloodPressure', 'diastolic', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                <input
                  type="number"
                  placeholder="bpm"
                  value={formData.vitalSigns.heartRate.value}
                  onChange={(e) => handleNestedInputChange('vitalSigns', 'heartRate', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="°F"
                  value={formData.vitalSigns.temperature.value}
                  onChange={(e) => handleNestedInputChange('vitalSigns', 'temperature', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="lbs"
                  value={formData.vitalSigns.weight.value}
                  onChange={(e) => handleNestedInputChange('vitalSigns', 'weight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation</label>
                <input
                  type="number"
                  placeholder="%"
                  value={formData.vitalSigns.oxygenSaturation.value}
                  onChange={(e) => handleNestedInputChange('vitalSigns', 'oxygenSaturation', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-500" />
                Medications
              </h3>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Medication
              </button>
            </div>

            {formData.medications.map((med, index) => (
              <div key={index} className="bg-white p-4 rounded-lg mb-3 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Instructions"
                    value={med.instructions}
                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Lab Results */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Lab Results
            </h3>
            
            {/* Standard Lab Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol Total</label>
                <input
                  type="number"
                  placeholder="mg/dL"
                  value={formData.labResults.cholesterol.total}
                  onChange={(e) => handleDeepNestedInputChange('labResults', 'cholesterol', 'total', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Glucose (Fasting)</label>
                <input
                  type="number"
                  placeholder="mg/dL"
                  value={formData.labResults.glucose.fasting}
                  onChange={(e) => handleDeepNestedInputChange('labResults', 'glucose', 'fasting', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HbA1c</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="%"
                  value={formData.labResults.hba1c.value}
                  onChange={(e) => handleDeepNestedInputChange('labResults', 'hba1c', 'value', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Lab Results */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Additional Lab Results</h4>
              <button
                type="button"
                onClick={addLabResult}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Result
              </button>
            </div>

            {formData.labResults.other.map((result, index) => (
              <div key={index} className="bg-white p-3 rounded-lg mb-2 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">Lab Result {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeLabResult(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Test name"
                    value={result.testName}
                    onChange={(e) => updateLabResult(index, 'testName', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={result.value}
                    onChange={(e) => updateLabResult(index, 'value', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={result.unit}
                    onChange={(e) => updateLabResult(index, 'unit', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Reference range"
                    value={result.reference}
                    onChange={(e) => updateLabResult(index, 'reference', e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Follow-up Notes
              </label>
              <textarea
                value={formData.followUpNotes}
                onChange={(e) => handleInputChange('followUpNotes', e.target.value)}
                placeholder="Notes for follow-up appointment..."
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
