import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CustomPieChart = ({ data, colors, totalAmount }) => {
  // Validate input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
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
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="text-gray-900 font-medium">{data.name}</p>
          <p className="text-gray-600">
            Amount: <span className="font-bold">${data.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>
          <p className="text-gray-600">
            Percentage: <span className="font-bold">{data.percentage}%</span>
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      {totalAmount && (
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Total: {totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;