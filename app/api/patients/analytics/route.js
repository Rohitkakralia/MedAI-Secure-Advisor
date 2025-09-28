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
    const timeRange = searchParams.get('timeRange') || '30days';
    const doctorEmail = session.user.email;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get all patients for the doctor
    const allPatients = await Patient.find({ doctorEmail });
    
    // Calculate age for each patient
    const patientsWithAge = allPatients.map(patient => ({
      ...patient.toObject(),
      age: calculateAge(patient.dateOfBirth)
    }));

    // Basic statistics
    const totalPatients = patientsWithAge.length;
    const highRiskPatients = patientsWithAge.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').length;
    const averageAge = patientsWithAge.length > 0 ? 
      Math.round(patientsWithAge.reduce((sum, p) => sum + p.age, 0) / patientsWithAge.length) : 0;

    // Risk level distribution
    const riskDistribution = {
      Low: patientsWithAge.filter(p => p.riskLevel === 'Low').length,
      Medium: patientsWithAge.filter(p => p.riskLevel === 'Medium').length,
      High: patientsWithAge.filter(p => p.riskLevel === 'High').length,
      Critical: patientsWithAge.filter(p => p.riskLevel === 'Critical').length
    };

    // Common conditions
    const conditionCounts = {};
    patientsWithAge.forEach(patient => {
      const condition = patient.primaryCondition;
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
    
    const commonConditions = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([condition, count]) => ({ condition, count }));

    // Recent patients (last 30 days)
    const recentPatients = patientsWithAge.filter(p => 
      new Date(p.createdAt) >= startDate
    ).length;

    // Patients with recent visits
    const recentVisits = patientsWithAge.filter(p => 
      new Date(p.lastVisit) >= startDate
    ).length;

    // Generate alerts based on patient data
    const alerts = [];
    
    if (patientsWithAge.length === 0) {
      alerts.push({
        type: 'Critical',
        message: 'No patients found - Add your first patient',
        patient: 'System'
      });
    }
    
    patientsWithAge.forEach(patient => {
      // Critical blood pressure alert
      if (patient.vitalSigns?.bloodPressure?.systolic > 180 || 
          patient.vitalSigns?.bloodPressure?.diastolic > 110) {
        alerts.push({
          type: 'Critical',
          message: `${patient.firstName} ${patient.lastName} - Blood pressure critically high (${patient.vitalSigns.bloodPressure.systolic}/${patient.vitalSigns.bloodPressure.diastolic})`,
          patient: `${patient.firstName} ${patient.lastName}`,
          patientId: patient._id
        });
      }
      
      // High HbA1c alert
      if (patient.labResults?.hba1c?.value > 8.0) {
        alerts.push({
          type: 'High',
          message: `${patient.firstName} ${patient.lastName} - HbA1c levels above target (${patient.labResults.hba1c.value}%)`,
          patient: `${patient.firstName} ${patient.lastName}`,
          patientId: patient._id
        });
      }
      
      // High cholesterol alert
      if (patient.labResults?.cholesterol?.total > 240) {
        alerts.push({
          type: 'High',
          message: `${patient.firstName} ${patient.lastName} - Cholesterol levels elevated (${patient.labResults.cholesterol.total} mg/dL)`,
          patient: `${patient.firstName} ${patient.lastName}`,
          patientId: patient._id
        });
      }
      
      // Overdue follow-up alert
      const daysSinceLastVisit = Math.floor((now - new Date(patient.lastVisit)) / (1000 * 60 * 60 * 24));
      if (daysSinceLastVisit > 90 && patient.riskLevel !== 'Low') {
        alerts.push({
          type: 'Medium',
          message: `${patient.firstName} ${patient.lastName} - Overdue for follow-up visit (${daysSinceLastVisit} days)`,
          patient: `${patient.firstName} ${patient.lastName}`,
          patientId: patient._id
        });
      }
    });

    // Generate treatment recommendations
    const recommendations = [];
    
    if (patientsWithAge.length === 0) {
      recommendations.push({
        type: 'Setup',
        message: 'Start by adding patient information',
        priority: 'High'
      });
    }
    
    patientsWithAge.forEach(patient => {
      // Medication adjustment recommendations
      if (patient.riskLevel === 'High' && (!patient.medications || patient.medications.length === 0)) {
        recommendations.push({
          type: 'Medication',
          message: `Consider medication therapy for ${patient.firstName} ${patient.lastName}`,
          priority: 'High',
          patientId: patient._id
        });
      }
      
      // Lifestyle recommendations
      if (patient.labResults?.cholesterol?.total > 200) {
        recommendations.push({
          type: 'Lifestyle',
          message: `Recommend dietary changes and exercise for ${patient.firstName} ${patient.lastName}`,
          priority: 'Medium',
          patientId: patient._id
        });
      }
      
      // Monitoring recommendations
      if (patient.riskLevel === 'Critical') {
        recommendations.push({
          type: 'Monitoring',
          message: `Schedule frequent monitoring for ${patient.firstName} ${patient.lastName}`,
          priority: 'High',
          patientId: patient._id
        });
      }
    });

    // Trends analysis (simplified)
    const trends = {
      bloodPressure: 'Stable',
      glucose: patientsWithAge.length > 0 ? 'Monitoring' : 'No data',
      cholesterol: patientsWithAge.length > 0 ? 'Monitoring' : 'No data',
      patientGrowth: recentPatients > 0 ? 'Growing' : 'Stable'
    };

    const analytics = {
      overview: {
        totalPatients,
        highRiskPatients,
        averageAge,
        recentPatients,
        recentVisits
      },
      riskDistribution,
      commonConditions,
      trends,
      alerts: alerts.slice(0, 10),
      recommendations: recommendations.slice(0, 10),
      timeRange,
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Error fetching patient analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
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