import { NextResponse } from 'next/server';
import connectDb from '@/db/connectDb';
import Patient from '@/models/Patient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
  // ... your existing POST implementation ...
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