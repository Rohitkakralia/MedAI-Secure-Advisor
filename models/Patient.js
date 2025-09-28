import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  // Basic Information
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },

  // Medical Information
  primaryCondition: {
    type: String,
    required: true
  },
  secondaryConditions: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Resolved'],
      default: 'Active'
    }
  }],
  allergies: [{
    allergen: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening'],
      default: 'Mild'
    },
    reaction: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String,
    status: {
      type: String,
      enum: ['Active', 'Discontinued', 'Completed'],
      default: 'Active'
    }
  }],

  // Vital Signs (Latest)
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      unit: {
        type: String,
        default: 'mmHg'
      },
      measuredAt: Date
    },
    heartRate: {
      value: Number,
      unit: {
        type: String,
        default: 'bpm'
      },
      measuredAt: Date
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        default: '°F'
      },
      measuredAt: Date
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: 'lbs'
      },
      measuredAt: Date
    },
    height: {
      value: Number,
      unit: {
        type: String,
        default: 'inches'
      },
      measuredAt: Date
    },
    oxygenSaturation: {
      value: Number,
      unit: {
        type: String,
        default: '%'
      },
      measuredAt: Date
    }
  },

  // Lab Results (Latest)
  labResults: {
    cholesterol: {
      total: Number,
      hdl: Number,
      ldl: Number,
      triglycerides: Number,
      unit: {
        type: String,
        default: 'mg/dL'
      },
      testDate: Date
    },
    glucose: {
      fasting: Number,
      random: Number,
      unit: {
        type: String,
        default: 'mg/dL'
      },
      testDate: Date
    },
    hba1c: {
      value: Number,
      unit: {
        type: String,
        default: '%'
      },
      testDate: Date
    },
    kidneyFunction: {
      creatinine: Number,
      bun: Number,
      unit: {
        type: String,
        default: 'mg/dL'
      },
      testDate: Date
    },
    liverFunction: {
      alt: Number,
      ast: Number,
      bilirubin: Number,
      unit: {
        type: String,
        default: 'U/L'
      },
      testDate: Date
    }
  },

  // Medical History
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    resolvedDate: Date,
    treatment: String,
    notes: String
  }],
  surgicalHistory: [{
    procedure: String,
    date: Date,
    surgeon: String,
    hospital: String,
    notes: String
  }],
  familyHistory: [{
    condition: String,
    relationship: String,
    ageOfOnset: Number,
    notes: String
  }],

  // Current Status
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  currentSymptoms: [{
    symptom: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe'],
      default: 'Mild'
    },
    onsetDate: Date,
    notes: String
  }],
  treatmentPlan: {
    current: String,
    goals: [String],
    nextAppointment: Date,
    followUpRequired: {
      type: Boolean,
      default: false
    }
  },

  // Doctor Information
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorEmail: {
    type: String,
    required: true
  },

  // Treatment History
  treatmentHistory: [{
    date: Date,
    treatment: String,
    doctor: String,
    doctorEmail: String,
    notes: String,
    followUpDate: Date
  }],

  // Appointments
  appointments: [{
    date: Date,
    time: String,
    type: {
      type: String,
      enum: ['Consultation', 'Follow-up', 'Emergency', 'Routine Check-up'],
      default: 'Consultation'
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled'
    },
    notes: String,
    doctor: String
  }],

  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    effectiveDate: Date,
    expiryDate: Date
  },

  // Additional Information
  notes: String,
  preferences: {
    language: {
      type: String,
      default: 'English'
    },
    communicationMethod: {
      type: String,
      enum: ['Phone', 'Email', 'SMS', 'Portal'],
      default: 'Phone'
    }
  },

  // Timestamps
  lastVisit: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PatientSchema.index({ assignedDoctor: 1 });
PatientSchema.index({ doctorEmail: 1 });
PatientSchema.index({ riskLevel: 1 });
PatientSchema.index({ primaryCondition: 1 });
PatientSchema.index({ lastName: 1, firstName: 1 });

// Virtual for full name
PatientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
PatientSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Method to get latest vital signs
PatientSchema.methods.getLatestVitalSigns = function() {
  return {
    bloodPressure: this.vitalSigns.bloodPressure ? 
      `${this.vitalSigns.bloodPressure.systolic}/${this.vitalSigns.bloodPressure.diastolic}` : 'N/A',
    heartRate: this.vitalSigns.heartRate ? this.vitalSigns.heartRate.value : 'N/A',
    temperature: this.vitalSigns.temperature ? this.vitalSigns.temperature.value : 'N/A',
    weight: this.vitalSigns.weight ? this.vitalSigns.weight.value : 'N/A',
    oxygenSaturation: this.vitalSigns.oxygenSaturation ? this.vitalSigns.oxygenSaturation.value : 'N/A'
  };
};

// Method to get latest lab results
PatientSchema.methods.getLatestLabResults = function() {
  return {
    cholesterol: this.labResults.cholesterol ? this.labResults.cholesterol.total : 'N/A',
    glucose: this.labResults.glucose ? this.labResults.glucose.fasting : 'N/A',
    hba1c: this.labResults.hba1c ? this.labResults.hba1c.value : 'N/A'
  };
};

// Method to get current medications
PatientSchema.methods.getCurrentMedications = function() {
  return this.medications.filter(med => med.status === 'Active');
};

// Method to get active conditions
PatientSchema.methods.getActiveConditions = function() {
  return this.secondaryConditions.filter(condition => condition.status === 'Active');
};

// Pre-save middleware to update lastVisit
PatientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
