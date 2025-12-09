import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CustomPieChart = ({ data, colors, totalAmount }) => {
  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 font-bold text-lg">No data available</p>
          <p className="text-gray-400 text-sm mt-1">Add some transactions to see the chart</p>
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
        <div className="bg-white p-5 border border-gray-200 shadow-2xl rounded-2xl">
          <p className="text-gray-900 font-bold text-xl">{data.name}</p>
          <p className="text-gray-600 mt-2">
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
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            labelLine={true}
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors && colors[index] ? colors[index] : `hsl(${index * 30}, 70%, 50%)`} 
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ paddingLeft: '25px' }}
            formatter={(value, entry, index) => (
              <span className="text-gray-700 font-medium pl-2">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {totalAmount && (
        <div className="text-center mt-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <p className="text-xl font-bold">Total: {totalAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;