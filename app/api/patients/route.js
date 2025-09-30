import { NextResponse } from 'next/server';
import connectDb from '@/db/connectDb';
import Patient from '@/models/Patient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDb();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const doctorEmail = searchParams.get('doctorEmail');
    const search = searchParams.get('search');
    const riskLevel = searchParams.get('riskLevel');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build query
    let query = { doctorEmail: doctorEmail || session.user.email };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { primaryCondition: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = riskLevel;
    }

    // Get patients without pagination for the analyzer
    const patients = await Patient.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    // Transform data for frontend - FIXED DATA MAPPING
    const transformedPatients = patients.map(patient => {
      // Calculate age
      const age = calculateAge(patient.dateOfBirth);
      
      // Get current medications
      const currentMedications = patient.medications ? 
        patient.medications.filter(med => med.status === 'Active').map(med => med.name) : [];
      
      // Get current symptoms
      const currentSymptoms = patient.currentSymptoms ? 
        patient.currentSymptoms.map(symptom => symptom.symptom) : [];

      return {
        id: patient._id.toString(),
        patientId: patient.patientId,
        name: `${patient.firstName} ${patient.lastName}`,
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: age,
        gender: patient.gender,
        condition: patient.primaryCondition,
        lastVisit: patient.lastVisit,
        riskLevel: patient.riskLevel,
        medications: currentMedications,
        vitalSigns: patient.vitalSigns || {},
        labResults: patient.labResults || {},
        symptoms: currentSymptoms,
        treatmentHistory: patient.treatmentHistory || [],
        phoneNumber: patient.phoneNumber,
        email: patient.email,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        allergies: patient.allergies || [],
        appointments: patient.appointments || [],
        notes: patient.notes,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      };
    });

    return NextResponse.json({
      patients: transformedPatients,
      total: transformedPatients.length
    });

  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

// POST - Create a new patient (keep your existing POST method)
export async function POST(request) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Required fields validation (basic)
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phoneNumber', 'primaryCondition'];
    for (const field of requiredFields) {
      if (!body?.[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Resolve assigned doctor by session email
    const doctor = await User.findOne({ email: session.user.email });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor user not found' }, { status: 404 });
    }

    // Generate a human-friendly patientId
    const patientId = `PT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Map vital signs from simple values to schema shape
    const vs = body.vitalSigns || {};
    const vitalSigns = {
      bloodPressure: vs.bloodPressure?.systolic || vs.bloodPressure?.diastolic ? {
        systolic: vs.bloodPressure?.systolic ? Number(vs.bloodPressure.systolic) : undefined,
        diastolic: vs.bloodPressure?.diastolic ? Number(vs.bloodPressure.diastolic) : undefined,
        unit: 'mmHg'
      } : undefined,
      heartRate: vs.heartRate ? { value: Number(vs.heartRate), unit: 'bpm' } : undefined,
      temperature: vs.temperature ? { value: Number(vs.temperature), unit: '°F' } : undefined,
      weight: vs.weight !== undefined && vs.weight !== '' ? { value: Number(vs.weight), unit: 'lbs' } : undefined,
      height: vs.height !== undefined && vs.height !== '' ? { value: Number(vs.height), unit: 'inches' } : undefined,
      oxygenSaturation: vs.oxygenSaturation !== undefined && vs.oxygenSaturation !== '' ? { value: Number(vs.oxygenSaturation), unit: '%' } : undefined
    };

    // Map lab results if provided (optional, minimal)
    const lr = body.labResults || {};
    const labResults = {
      cholesterol: lr.cholesterol?.total ? { total: Number(lr.cholesterol.total), unit: 'mg/dL' } : undefined,
      glucose: lr.glucose?.fasting ? { fasting: Number(lr.glucose.fasting), unit: 'mg/dL' } : undefined,
      hba1c: lr.hba1c?.value ? { value: Number(lr.hba1c.value), unit: '%' } : undefined
    };

    const newPatient = new Patient({
      patientId,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      email: body.email || '',
      address: {
        addressLine: body.address?.addressLine || '',
        zipCode: body.address?.zipCode || '',
        country: body.address?.country || 'USA'
      },
      emergencyContact: body.emergencyContact || {},
      primaryCondition: body.primaryCondition,
      secondaryConditions: body.secondaryConditions || [],
      allergies: body.allergies || [],
      medications: body.medications || [],
      vitalSigns,
      labResults,
      riskLevel: body.riskLevel || 'Medium',
      currentSymptoms: body.currentSymptoms || [],
      notes: body.notes || '',
      assignedDoctor: doctor._id,
      doctorEmail: doctor.email
    });

    await newPatient.save();

    return NextResponse.json({ success: true, patient: {
      id: newPatient._id.toString(),
      patientId: newPatient.patientId,
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      dateOfBirth: newPatient.dateOfBirth,
      gender: newPatient.gender,
      phoneNumber: newPatient.phoneNumber,
      email: newPatient.email,
      riskLevel: newPatient.riskLevel,
      doctorEmail: newPatient.doctorEmail
    } });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}