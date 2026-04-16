import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { addThousandsSeparator } from "../util/utils";

const SpendingTrendChart = ({ data }) => {
  // Validate and clean data
  const validData = Array.isArray(data) 
    ? data.filter(item => item && typeof item.month === 'string' && typeof item.total === 'number')
    : [];

  if (validData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-8">
        <p className="font-bold uppercase tracking-widest text-sm">No historical data available</p>
        <p className="text-xs mt-2 text-center text-gray-500">Charts will appear once you have multi-month history</p>
      </div>
    );
  }

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-5 border-2 border-purple-100 shadow-2xl rounded-2xl animate-fadeIn">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">{label}</p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-600 rounded-full shadow-lg"></div>
            <p className="text-gray-900 font-extrabold text-2xl">
              ${addThousandsSeparator(payload[0].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] animate-fadeIn">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={validData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f1f5f9" 
            strokeWidth={1}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
            dy={15}
            tickFormatter={(value) => value.substring(0, 3)}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
            tickFormatter={(value) => `$${addThousandsSeparator(value)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#7c3aed"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorTotal)"
            animationDuration={1500}
            activeDot={{ r: 8, fill: "#7c3aed", stroke: "#fff", strokeWidth: 3, shadow: "0 10px 15px rgba(0,0,0,0.1)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTrendChart;
