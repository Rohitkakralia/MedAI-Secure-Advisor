import { NextResponse } from 'next/server';
import connectDb from '@/db/connectDb';
import Patient from '@/models/Patient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch a specific patient
export async function GET(request, { params }) {
  try {
    await connectDb();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const patient = await Patient.findOne({ 
      _id: id, 
      doctorEmail: session.user.email 
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Transform data for frontend
    const transformedPatient = {
      id: patient._id,
      patientId: patient.patientId,
      name: `${patient.firstName} ${patient.lastName}`,
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      phoneNumber: patient.phoneNumber,
      email: patient.email,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      condition: patient.primaryCondition,
      secondaryConditions: patient.secondaryConditions || [],
      lastVisit: patient.lastVisit,
      riskLevel: patient.riskLevel,
      medications: patient.medications || [],
      vitalSigns: patient.vitalSigns || {},
      labResults: patient.labResults || {},
      symptoms: patient.currentSymptoms || [],
      treatmentHistory: patient.treatmentHistory || [],
      medicalHistory: patient.medicalHistory || [],
      surgicalHistory: patient.surgicalHistory || [],
      familyHistory: patient.familyHistory || [],
      allergies: patient.allergies || [],
      appointments: patient.appointments || [],
      treatmentPlan: patient.treatmentPlan || {},
      insurance: patient.insurance || {},
      notes: patient.notes,
      preferences: patient.preferences || {},
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    };

    return NextResponse.json({ patient: transformedPatient });

  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  }
}

// PUT - Update a specific patient
export async function PUT(request, { params }) {
  try {
    await connectDb();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Find patient and ensure it belongs to the doctor
    const patient = await Patient.findOne({ 
      _id: id, 
      doctorEmail: session.user.email 
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Update patient data
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date(),
        lastVisit: new Date()
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Patient updated successfully',
      patient: {
        id: updatedPatient._id,
        patientId: updatedPatient.patientId,
        name: updatedPatient.fullName,
        firstName: updatedPatient.firstName,
        lastName: updatedPatient.lastName,
        age: updatedPatient.age,
        gender: updatedPatient.gender,
        condition: updatedPatient.primaryCondition,
        riskLevel: updatedPatient.riskLevel,
        updatedAt: updatedPatient.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

// DELETE - Delete a specific patient
export async function DELETE(request, { params }) {
  try {
    await connectDb();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find patient and ensure it belongs to the doctor
    const patient = await Patient.findOne({ 
      _id: id, 
      doctorEmail: session.user.email 
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await Patient.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Patient deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
