// components/PatientAnalyzer.js
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Weight, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const PatientAnalyzer = ({ patient, onClose }) => {
  const [vitalData, setVitalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30days');
  const [expandedCharts, setExpandedCharts] = useState({
    bloodPressure: true,
    heartRate: true,
    weight: true,
    temperature: true,
    oxygenSaturation: true
  });

  useEffect(() => {
    if (patient) {
      fetchPatientVitalHistory();
    }
  }, [patient, timeRange]);

  const fetchPatientVitalHistory = async () => {
    const id = patient?.id; 
    console.log(id);// no await needed
    if (!id) return;

    
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`/api/appointments/${id}?timeRange=${timeRange}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
  
      const data = await response.json();
      setVitalData(data);
    } catch (error) {
      console.error("Error fetching vital history:", error);
      setError("Failed to load patient data. Please try again.");
      // Fallback to mock data
      generateMockVitalData();
    } finally {
      setIsLoading(false);
    }
  };
  

  const generateMockVitalData = () => {
    const mockData = {
      bloodPressure: generateTimeSeriesData(120, 80, 10, 5),
      heartRate: generateTimeSeriesData(72, 5),
      weight: generateTimeSeriesData(patient?.vitalSigns?.weight?.value || 160, 3),
      temperature: generateTimeSeriesData(98.6, 0.5),
      oxygenSaturation: generateTimeSeriesData(98, 1),
      height: generateTimeSeriesData(patient?.vitalSigns?.height?.value || 68, 0.5)
    };
    setVitalData(mockData);
  };

  const generateTimeSeriesData = (baseValue, variation1, variation2 = null) => {
    const data = [];
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (variation2) {
        data.push({
          date: date.toISOString().split('T')[0],
          systolic: Math.round(baseValue + (Math.random() * variation1 * 2 - variation1)),
          diastolic: Math.round(variation2 + (Math.random() * variation1 * 2 - variation1))
        });
      } else {
        data.push({
          date: date.toISOString().split('T')[0],
          value: baseValue + (Math.random() * variation1 * 2 - variation1)
        });
      }
    }
    return data;
  };

  const toggleChart = (chart) => {
    setExpandedCharts(prev => ({
      ...prev,
      [chart]: !prev[chart]
    }));
  };

  const exportData = () => {
    if (!vitalData) return;
    
    const csvContent = Object.entries(vitalData)
      .filter(([_, data]) => data && data.length > 0)
      .map(([metric, data]) => {
        const header = `Date,${metric}\n`;
        const rows = data.map(item => {
          if (item.systolic) {
            return `${item.date},${item.systolic}/${item.diastolic}`;
          }
          return `${item.date},${item.value?.toFixed(1) || 'N/A'}`;
        }).join('\n');
        return header + rows;
      }).join('\n\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patient.name.replace(/\s+/g, '_')}_vital_signs_${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const LineChart = ({ data, title, color, yAxisLabel, isBloodPressure = false }) => {
    if (!data || data.length === 0) return null;

    const chartHeight = 200;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // Calculate scales
    const dates = data.map(d => new Date(d.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    let values = [];
    if (isBloodPressure) {
      values = [...data.map(d => d.systolic), ...data.map(d => d.diastolic)];
    } else {
      values = data.map(d => d.value);
    }

    const minValue = Math.min(...values) * 0.95;
    const maxValue = Math.max(...values) * 1.05;

    const xScale = (date) => {
      const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
      const currentDay = (new Date(date) - minDate) / (1000 * 60 * 60 * 24);
      return (currentDay / totalDays) * width;
    };

    const yScale = (value) => {
      return height - ((value - minValue) / (maxValue - minValue)) * height;
    };

    const generatePath = (getY) => {
      const points = data.map((d, i) => {
        const x = xScale(d.date);
        const y = getY(d);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ');
      return points;
    };

    const systolicPath = isBloodPressure ? generatePath(d => yScale(d.systolic)) : '';
    const diastolicPath = isBloodPressure ? generatePath(d => yScale(d.diastolic)) : '';
    const singlePath = !isBloodPressure ? generatePath(d => yScale(d.value)) : '';

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            {title}
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {data.length} records
            </span>
          </h3>
          <button
            onClick={() => toggleChart(title.toLowerCase().replace(' ', ''))}
            className="text-gray-400 hover:text-gray-600"
          >
            {expandedCharts[title.toLowerCase().replace(' ', '')] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {expandedCharts[title.toLowerCase().replace(' ', '')] && (
          <div className="overflow-x-auto">
            <svg width={600} height={chartHeight} className="min-w-full">
              {/* Y-axis label */}
              <text
                x={-height / 2}
                y={15}
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {yAxisLabel}
              </text>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const value = minValue + (maxValue - minValue) * ratio;
                const y = yScale(value);
                return (
                  <g key={ratio}>
                    <line
                      x1={0}
                      y1={y}
                      x2={width}
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                    />
                    <text
                      x={-5}
                      y={y + 3}
                      textAnchor="end"
                      className="text-xs fill-gray-500"
                    >
                      {value.toFixed(isBloodPressure ? 0 : 1)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => {
                const x = xScale(d.date);
                return (
                  <text
                    key={i}
                    x={x}
                    y={height + 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {new Date(d.date).toLocaleDateString()}
                  </text>
                );
              })}

              {/* Lines */}
              {isBloodPressure ? (
                <>
                  <path
                    d={systolicPath}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d={diastolicPath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <path
                  d={singlePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}

              {/* Data points */}
              {data.map((d, i) => {
                const x = xScale(d.date);
                if (isBloodPressure) {
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yScale(d.systolic)} r={3} fill="#ef4444" />
                      <circle cx={x} cy={yScale(d.diastolic)} r={3} fill="#3b82f6" />
                    </g>
                  );
                }
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={yScale(d.value)}
                    r={3}
                    fill={color}
                  />
                );
              })}
            </svg>
          </div>
        )}

        {isBloodPressure && expandedCharts[title.toLowerCase().replace(' ', '')] && (
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-600">Systolic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-600">Diastolic</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a patient to view analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Patient Analysis: {patient.name}
          </h2>
          <p className="text-gray-600">
            Tracking vital signs and health metrics over time
          </p>
        </div>
        <div className="flex items-center  space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button
            onClick={fetchPatientVitalHistory}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportData}
            disabled={!vitalData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

{!isLoading && vitalData && Object.values(vitalData).every(data => !data || data.length === 0) && (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
    <p className="text-gray-500">
      No vital sign data found for the selected time period.
    </p>
    <p className="text-sm text-gray-400 mt-1">
      Add appointments with vital signs to see analysis charts.
    </p>
  </div>
)}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading patient data...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {vitalData?.bloodPressure && vitalData.bloodPressure.length > 0 && (
            <LineChart
              data={vitalData.bloodPressure}
              title="Blood Pressure"
              color="#3b82f6"
              yAxisLabel="mmHg"
              isBloodPressure={true}
            />
          )}

          {vitalData?.heartRate && vitalData.heartRate.length > 0 && (
            <LineChart
              data={vitalData.heartRate}
              title="Heart Rate"
              color="#ef4444"
              yAxisLabel="BPM"
            />
          )}

          {vitalData?.weight && vitalData.weight.length > 0 && (
            <LineChart
              data={vitalData.weight}
              title="Weight"
              color="#10b981"
              yAxisLabel="lbs"
            />
          )}

          {vitalData?.temperature && vitalData.temperature.length > 0 && (
            <LineChart
              data={vitalData.temperature}
              title="Temperature"
              color="#f59e0b"
              yAxisLabel="°F"
            />
          )}

          {vitalData?.oxygenSaturation && vitalData.oxygenSaturation.length > 0 && (
            <LineChart
              data={vitalData.oxygenSaturation}
              title="Oxygen Saturation"
              color="#8b5cf6"
              yAxisLabel="%"
            />
          )}

          {vitalData?.height && vitalData.height.length > 0 && (
            <LineChart
              data={vitalData.height}
              title="Height"
              color="#6b7280"
              yAxisLabel="inches"
            />
          )}
        </div>
      )}

      {/* Summary Statistics */}
      {vitalData && !isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {vitalData.bloodPressure && vitalData.bloodPressure.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Avg. BP</p>
              <p className="text-xl font-bold text-blue-900">
                {Math.round(vitalData.bloodPressure.reduce((sum, d) => sum + d.systolic, 0) / vitalData.bloodPressure.length)}/
                {Math.round(vitalData.bloodPressure.reduce((sum, d) => sum + d.diastolic, 0) / vitalData.bloodPressure.length)}
              </p>
            </div>
          )}

          {vitalData.heartRate && vitalData.heartRate.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Avg. Heart Rate</p>
              <p className="text-xl font-bold text-red-900">
                {Math.round(vitalData.heartRate.reduce((sum, d) => sum + d.value, 0) / vitalData.heartRate.length)} BPM
              </p>
            </div>
          )}

          {vitalData.weight && vitalData.weight.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Avg. Weight</p>
              <p className="text-xl font-bold text-green-900">
                {Math.round(vitalData.weight.reduce((sum, d) => sum + d.value, 0) / vitalData.weight.length)} lbs
              </p>
            </div>
          )}

          {vitalData.temperature && vitalData.temperature.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Avg. Temp</p>
              <p className="text-xl font-bold text-yellow-900">
                {(vitalData.temperature.reduce((sum, d) => sum + d.value, 0) / vitalData.temperature.length).toFixed(1)}°F
              </p>
            </div>
          )}

          {vitalData.oxygenSaturation && vitalData.oxygenSaturation.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Avg. SpO2</p>
              <p className="text-xl font-bold text-purple-900">
                {Math.round(vitalData.oxygenSaturation.reduce((sum, d) => sum + d.value, 0) / vitalData.oxygenSaturation.length)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientAnalyzer;