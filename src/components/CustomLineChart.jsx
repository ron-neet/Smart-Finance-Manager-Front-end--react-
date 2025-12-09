import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

// Format date to show in a more readable format (e.g., "8th Jul")
const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  
  // Add ordinal suffix to day
  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${day}${ordinalSuffix(day)} ${month}`;
};

// Format number with commas for Y-axis
const formatNumber = (value) => {
  return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// Custom tooltip component for better display
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Get the full data point
    return (
      <div className="bg-white p-5 border border-gray-200 shadow-2xl rounded-2xl">
        <p className="text-gray-900 font-bold text-xl">{label}</p>
        {data.name && (
          <p className="text-gray-600 text-base mt-2">{data.name}</p>
        )}
        <p className="text-violet-600 mt-3">
          Amount: <span className="font-bold text-gray-800 text-lg">${payload[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLineChart = ({ data, type = "income" }) => {
  // Validate input data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 font-bold text-lg">No valid data provided</p>
          <p className="text-gray-400 text-sm mt-1">Add some transactions to see the chart</p>
        </div>
      </div>
    );
  }

  // Format the data for display - Show all data points without filtering
  const formattedData = data.map((item, index) => ({
    date: formatDate(item.date),
    amount: parseFloat(item.amount),
    name: item.name,
    // Create a unique key for each data point to prevent overlap issues
    uniqueKey: item.id !== undefined ? `${formatDate(item.date)}-${item.id}` : `${formatDate(item.date)}-${index}`
  }));

  // If no data after processing, show a message
  if (formattedData.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 font-bold text-lg">No {type} data available</p>
          <p className="text-gray-400 text-sm mt-1">Add some transactions to see the chart</p>
        </div>
      </div>
    );
  }

  // Calculate Y-axis domain with consistent padding
  const getYAxisDomain = (data) => {
    const amounts = data.map(item => item.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    
    // Add 10% padding to the top and ensure minimum is 0
    const padding = (max - min) * 0.1;
    return [0, max + padding];
  };

  // Determine interval for X-axis ticks based on data length
  const getXAxisInterval = (dataLength) => {
    if (dataLength <= 5) return 0; // Show all labels
    if (dataLength <= 10) return 1; // Show every 2nd label
    if (dataLength <= 20) return 3; // Show every 4th label
    return Math.floor(dataLength / 8); // Show approximately 8 labels
  };

  // Define colors based on type
  const chartColor = type === "expense" ? "#dc2626" : "#7c3aed"; // Red for expense, purple for income
  const gradientStart = type === "expense" ? "#dc2626" : "#7c3aed";
  const gradientEnd = type === "expense" ? "#dc2626" : "#7c3aed";

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 25, right: 35, left: 25, bottom: 25 }}>
          <defs>
            <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor={gradientStart} stopOpacity={0.4} />
              <stop offset="90%" stopColor={gradientEnd} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            interval={getXAxisInterval(formattedData.length)}
            tick={{ dy: 12, fontSize: 14, fontWeight: 'bold' }}
            height={45}
            tickMargin={12}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={formatNumber}
            domain={getYAxisDomain(formattedData)}
            width={85}
            tick={{ dx: -8, fontSize: 14, fontWeight: 'bold' }}
            tickMargin={12}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: chartColor, strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke={chartColor}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#color${type})`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={chartColor}
            strokeWidth={4}
            dot={{ r: 6, fill: chartColor }}
            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;