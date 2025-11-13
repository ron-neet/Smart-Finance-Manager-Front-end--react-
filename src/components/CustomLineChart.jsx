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
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
        <p className="text-gray-900 font-medium">{label}</p>
        {data.name && (
          <p className="text-gray-600 text-sm">{data.name}</p>
        )}
        <p className="text-violet-600">
          Amount: <span className="font-bold">${payload[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLineChart = ({ data }) => {
  // Validate input data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No valid data provided</p>
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
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No income data available</p>
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

  return (
    <div className="w-full h-[300px] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#7c3aed" stopOpacity={0.4} />
              <stop offset="90%" stopColor="#7c3aed" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            interval={getXAxisInterval(formattedData.length)}
            tick={{ dy: 10 }}
            height={40}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={formatNumber}
            domain={getYAxisDomain(formattedData)}
            width={80}
            tick={{ dx: -5 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#7c3aed", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#7c3aed"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ r: 4, fill: "#7c3aed" }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;