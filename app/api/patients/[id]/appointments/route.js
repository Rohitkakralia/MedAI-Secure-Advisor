import { NextResponse } from 'next/server';
import connectDb from '@/db/connectDb';
import Patient from '@/models/Patient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


// const normalizeVitalSigns = (vitalSigns) => ({
//   bloodPressure: {
//     systolic: vitalSigns.bloodPressure?.systolic !== undefined
//       ? Number(vitalSigns.bloodPressure.systolic) 
//       : null,
//     diastolic: vitalSigns.bloodPressure?.diastolic !== undefined
//       ? Number(vitalSigns.bloodPressure.diastolic) 
//       : null,
//   },
//   heartRate: {
//     value: vitalSigns.heartRate?.value !== undefined
//       ? Number(vitalSigns.heartRate.value)
//       : null,
//     unit: 'bpm'
//   },
//   temperature: {
//     value: vitalSigns.temperature?.value !== undefined
//       ? Number(vitalSigns.temperature.value)
//       : null,
//     unit: '°F'
//   },
//   weight: {
//     value: vitalSigns.weight?.value !== undefined
//       ? Number(vitalSigns.weight.value)
//       : null,
//     unit: 'lbs'
//   },
//   oxygenSaturation: {
//     value: vitalSigns.oxygenSaturation?.value !== undefined
//       ? Number(vitalSigns.oxygenSaturation.value)
//       : null,
//     unit: '%'
//   }
// });

const normalizeVitalSigns = (vitalSigns) => ({
  bloodPressure: {
    systolic: vitalSigns.bloodPressure?.systolic !== undefined
      ? Number(vitalSigns.bloodPressure.systolic)
      : null,
    diastolic: vitalSigns.bloodPressure?.diastolic !== undefined
      ? Number(vitalSigns.bloodPressure.diastolic)
      : null,
    unit: 'mmHg'
  },
  heartRate: {
    value: vitalSigns.heartRate !== undefined
      ? Number(vitalSigns.heartRate)
      : null,
    unit: 'bpm'
  },
  temperature: {
    value: vitalSigns.temperature !== undefined
      ? Number(vitalSigns.temperature)
      : null,
    unit: '°F'
  },
  weight: {
    value: vitalSigns.weight !== undefined
      ? Number(vitalSigns.weight)
      : null,
    unit: 'lbs'
  },
  oxygenSaturation: {
    value: vitalSigns.oxygenSaturation !== undefined
      ? Number(vitalSigns.oxygenSaturation)
      : null,
    unit: '%'
  }
});


const normalizeLabResults = (labResults) => ({
  cholesterol: {
    total: Number(labResults.cholesterol?.total) || null,
    ldl: Number(labResults.cholesterol?.ldl) || null,
    hdl: Number(labResults.cholesterol?.hdl) || null,
    unit: 'mg/dL'
  },
  glucose: {
    fasting: Number(labResults.glucose?.fasting) || null,
    random: Number(labResults.glucose?.random) || null,
    unit: 'mg/dL'
  },
  hba1c: {
    value: Number(labResults.hba1c?.value) || null,
    unit: '%'
  },
  other: labResults.other || []
});


// POST - Add new appointment to existing patient
export async function POST(request, context) {
  try {
    await connectDb();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { params } = await context; 
    const { id } = params;
    const body = await request.json();

    
    const {
      date,
      time,
      type = 'Consultation',
      notes = '',
      treatment = '',
      diagnosis = '',
      medications = [],
      vitalSigns = {},
      labResults = {},
      followUpDate,
      followUpNotes = ''
    } = body;

    console.log("without Normalize :", vitalSigns);

    const normalizedVitalSigns = normalizeVitalSigns(vitalSigns);
    const normalizedLabResults = normalizeLabResults(labResults);

    console.log("with normalize:", normalizeVitalSigns);

    // Validate required fields
    if (!date || !time) {
      return NextResponse.json({ 
        error: 'Date and time are required' 
      }, { status: 400 });
    }

    // Find the patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ 
        error: 'Patient not found' 
      }, { status: 404 });
    }

    // Check if doctor has access to this patient
    if (patient.doctorEmail !== session.user.email) {
      return NextResponse.json({ 
        error: 'Access denied' 
      }, { status: 403 });
    }

    // Create new appointment
    const newAppointment = {
      date: new Date(date),
      time,
      type,
      status: 'Completed',
      notes,
      doctor: session.user.name || session.user.email,
      doctorEmail: session.user.email,
      treatment,
      diagnosis,
      medications,
      vitalSigns: normalizedVitalSigns,
      labResults: normalizedLabResults,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpNotes,
      createdAt: new Date()
    };

    // Add to treatment history
    const newTreatmentEntry = {
      date: new Date(date),
      treatment: treatment || type,
      doctor: session.user.name || session.user.email,
      doctorEmail: session.user.email,
      notes,
      diagnosis,
      medications,
      vitalSigns: normalizedVitalSigns,   // 👈 matches schema
      labResults: normalizedLabResults,   // 👈 matches schema
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpNotes,
      appointmentId: `appt_${Date.now()}`
    };

    // Update patient with new appointment and treatment
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        $push: {
          appointments: newAppointment,
          treatmentHistory: newTreatmentEntry
        },
        $set: {
          lastVisit: new Date(date),
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Appointment and treatment added successfully',
      appointment: newAppointment,
      treatment: newTreatmentEntry,
      patient: {
        id: updatedPatient._id,
        name: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
        lastVisit: updatedPatient.lastVisit
      }
    });

  } catch (error) {
    console.error('Error adding appointment:', error);
    return NextResponse.json({ 
      error: 'Failed to add appointment' 
    }, { status: 500 });
  }
}

// GET - Get all appointments for a patient
export async function GET(request, { params }) {
  try {
    await connectDb();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Find the patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ 
        error: 'Patient not found' 
      }, { status: 404 });
    }

    // Check if doctor has access to this patient
    if (patient.doctorEmail !== session.user.email) {
      return NextResponse.json({ 
        error: 'Access denied' 
      }, { status: 403 });
    }

    return NextResponse.json({
      appointments: patient.appointments || [],
      treatmentHistory: patient.treatmentHistory || []
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch appointments' 
    }, { status: 500 });
  }
}
