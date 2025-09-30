import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const RiskPieChart = ({ totalPatients, highRiskPatients }) => {
  // Calculate low-risk patients
  const lowRiskPatients = totalPatients - highRiskPatients;

  // Prepare the data for the pie chart
  const data = {
    labels: ['High Risk', 'Low Risk'],
    datasets: [
      {
        data: [highRiskPatients, lowRiskPatients],
        backgroundColor: ['#FF6347', '#66CC66'], // Red for high risk, Green for low risk
        borderColor: ['#FF6347', '#66CC66'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Patient Risk Breakdown</h3>
      <Pie data={data} options={{ responsive: true }} />
    </div>
  );
};

export default RiskPieChart;
