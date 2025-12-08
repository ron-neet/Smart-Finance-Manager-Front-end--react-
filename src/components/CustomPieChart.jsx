import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CustomPieChart = ({ data, colors, totalAmount }) => {
  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 font-medium">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  // Format data for display
  const formattedData = data.map((entry, index) => ({
    ...entry,
    value: entry.amount || 0,
    percentage: total > 0 ? ((entry.amount || 0) / total * 100).toFixed(1) : 0
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-xl">
          <p className="text-gray-900 font-bold text-lg">{data.name}</p>
          <p className="text-gray-600 mt-1">
            Amount: <span className="font-bold text-gray-800">${data.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>
          <p className="text-gray-600">
            Percentage: <span className="font-bold text-gray-800">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors && colors[index] ? colors[index] : `hsl(${index * 30}, 70%, 50%)`} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ paddingLeft: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {totalAmount && (
        <div className="text-center mt-6">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-lg font-bold">Total: {totalAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;