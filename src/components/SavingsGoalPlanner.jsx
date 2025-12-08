import React, { useState, useEffect } from "react";
import { calculateSavingsProjection, calculateRequiredSavings, analyzeIncomeStability } from "../util/savingsInvestment";
import { addThousandsSeparator } from "../util/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Target, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";

const SavingsGoalPlanner = ({ totalBalance, incomeHistory, expenseHistory }) => {
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [targetDate, setTargetDate] = useState("");
  const [projection, setProjection] = useState(null);
  const [requiredSavings, setRequiredSavings] = useState(null);
  const [incomeStability, setIncomeStability] = useState(null);
  const [projectionType, setProjectionType] = useState("average"); // "conservative" | "average" | "optimistic"
  const [activeTab, setActiveTab] = useState("projection"); // "projection" | "required" | "stability"

  // Calculate projection when data changes
  useEffect(() => {
    if (totalBalance !== undefined && incomeHistory && expenseHistory) {
      const result = calculateSavingsProjection(
        totalBalance || 0,
        incomeHistory,
        expenseHistory,
        savingsGoal,
        projectionType
      );
      setProjection(result);
    }
  }, [totalBalance, incomeHistory, expenseHistory, savingsGoal, projectionType]);

  // Calculate required savings when target date changes
  useEffect(() => {
    if (targetDate && totalBalance !== undefined && incomeHistory && expenseHistory && savingsGoal) {
      const result = calculateRequiredSavings(
        totalBalance || 0,
        incomeHistory,
        expenseHistory,
        savingsGoal,
        targetDate
      );
      setRequiredSavings(result);
    }
  }, [totalBalance, incomeHistory, expenseHistory, savingsGoal, targetDate]);

  // Analyze income stability
  useEffect(() => {
    if (incomeHistory && expenseHistory) {
      const result = analyzeIncomeStability(incomeHistory, expenseHistory);
      setIncomeStability(result);
    }
  }, [incomeHistory, expenseHistory]);

  const handleGoalChange = (e) => {
    setSavingsGoal(Number(e.target.value));
  };

  const handleDateChange = (e) => {
    setTargetDate(e.target.value);
  };

  const handleProjectionTypeChange = (type) => {
    setProjectionType(type);
  };

  // Prepare chart data for savings projection
  const prepareProjectionChartData = () => {
    if (!projection || !projection.isAchievable) return [];
    
    const data = [];
    const currentSavings = totalBalance || 0;
    const monthlySavings = projection.monthlySavings;
    
    // Add current savings as starting point
    data.push({
      month: "Current",
      savings: currentSavings,
      goal: savingsGoal
    });
    
    // Add projected savings for next 12 months or until goal is reached
    for (let i = 1; i <= Math.min(12, projection.monthsToGoal); i++) {
      const monthName = new Date(new Date().setMonth(new Date().getMonth() + i)).toLocaleDateString('en-US', { month: 'short' });
      data.push({
        month: monthName,
        savings: currentSavings + (monthlySavings * i),
        goal: savingsGoal
      });
    }
    
    // Ensure goal line is visible
    if (projection.monthsToGoal > 12) {
      data.push({
        month: "Goal",
        savings: savingsGoal,
        goal: savingsGoal
      });
    }
    
    return data;
  };

  // Prepare chart data for income stability
  const prepareIncomeStabilityChartData = () => {
    if (!incomeHistory || !expenseHistory) return [];
    
    return incomeHistory.map((income, index) => {
      const expense = expenseHistory[index] || 0;
      const savings = income - expense;
      return {
        month: `Month ${index + 1}`,
        income: income,
        expense: expense,
        savings: savings
      };
    });
  };

  const projectionChartData = prepareProjectionChartData();
  const incomeStabilityChartData = prepareIncomeStabilityChartData();

  // Safely format currency values
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return `$${addThousandsSeparator(parseFloat(value).toFixed(2))}`;
  };

  // Safely get total balance value
  const displayBalance = totalBalance !== undefined && totalBalance !== null ? totalBalance : 0;

  return (
    <div className="w-full">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Savings Goal Planner</h2>
            </div>
            <p className="text-gray-600">
              Set your savings goals and track your progress with detailed projections
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <DollarSign size={20} />
              <div>
                <p className="text-sm">Current Balance</p>
                <p className="text-xl font-bold">{formatCurrency(displayBalance)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Goal Input */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Savings Goal ($)
          </label>
          <div className="relative max-w-md">
            <input
              type="number"
              value={savingsGoal}
              onChange={handleGoalChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg shadow-sm transition-all"
              placeholder="Enter your savings goal"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5">
              <span className="text-gray-500 font-medium">USD</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-8 font-medium text-base rounded-t-xl transition-all duration-300 ${
            activeTab === "projection"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("projection")}
        >
          Time Projection
        </button>
        <button
          className={`py-4 px-8 font-medium text-base rounded-t-xl transition-all duration-300 ${
            activeTab === "required"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("required")}
        >
          Required Savings
        </button>
        <button
          className={`py-4 px-8 font-medium text-base rounded-t-xl transition-all duration-300 ${
            activeTab === "stability"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("stability")}
        >
          Income Analysis
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === "projection" && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chart Section - Left Side */}
            <div className="lg:w-7/12 h-96">
              {projectionChartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      formatter={(value) => [`$${addThousandsSeparator(parseFloat(value).toFixed(2))}`, 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        border: '1px solid #eee',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      name="Projected Savings" 
                      stroke="#7c3aed" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#7c3aed' }} 
                      activeDot={{ r: 8, stroke: '#7c3aed', strokeWidth: 2 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      name="Savings Goal" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 6, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {/* Content Section - Right Side */}
            <div className="lg:w-5/12">
              {/* Projection Type Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Projection Type</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`px-5 py-3 text-sm rounded-xl font-medium transition-all duration-300 shadow-md ${
                      projectionType === "conservative"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => handleProjectionTypeChange("conservative")}
                  >
                    Conservative
                  </button>
                  <button
                    className={`px-5 py-3 text-sm rounded-xl font-medium transition-all duration-300 shadow-md ${
                      projectionType === "average"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                    onClick={() => handleProjectionTypeChange("average")}
                  >
                    Average
                  </button>
                  <button
                    className={`px-5 py-3 text-sm rounded-xl font-medium transition-all duration-300 shadow-md ${
                      projectionType === "optimistic"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                    onClick={() => handleProjectionTypeChange("optimistic")}
                  >
                    Optimistic
                  </button>
                </div>
              </div>
              
              {projection ? (
                <div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl mb-8 border border-purple-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Projection Summary</h3>
                    {projection.isAchievable ? (
                      <div className="flex items-end gap-3 mb-6">
                        <p className="text-4xl font-bold text-purple-600">
                          {projection.monthsToGoal}
                        </p>
                        <div>
                          <p className="text-xl font-medium">months</p>
                          <p className="text-gray-600">({projection.yearsToGoal} years)</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-600 font-medium text-lg mb-4">
                        Current spending exceeds income. Goal not achievable without changes.
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">Min/Month</p>
                        <p className="font-bold text-red-500 text-lg">{formatCurrency(projection.minSavings)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">Average</p>
                        <p className="font-bold text-yellow-500 text-lg">{formatCurrency(projection.averageSavings)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">Max/Month</p>
                        <p className="font-bold text-green-500 text-lg">{formatCurrency(projection.maxSavings)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">Recommendations</h3>
                    <ul className="space-y-4">
                      {projection.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl text-center border border-gray-200">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Enter your financial details to see projections</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "required" && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={handleDateChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg shadow-sm transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                  <Calendar className="text-gray-400" size={20} />
                </div>
              </div>
            </div>
            
            {requiredSavings ? (
              <div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl mb-8 border border-green-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Required Savings</h3>
                  {requiredSavings.isFeasible ? (
                    <div className="flex items-end gap-3 mb-4">
                      <p className="text-4xl font-bold text-green-600">
                        {formatCurrency(requiredSavings.requiredMonthlySavings)}
                      </p>
                      <p className="text-xl text-gray-600">per month</p>
                    </div>
                  ) : (
                    <p className="text-red-600 font-medium text-lg mb-4">{requiredSavings.message}</p>
                  )}
                  <p className="text-gray-600">
                    For {requiredSavings.monthsUntilTarget} months • Income volatility: {requiredSavings.incomeVolatility ? requiredSavings.incomeVolatility.toFixed(1) : '0'}%
                  </p>
                </div>
                
                {requiredSavings.isFeasible && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">Tips to Reach Your Goal</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">
                          Set up an automatic transfer to your savings account during high-income periods
                        </span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">
                          During peak earning months, save extra to compensate for leaner months
                        </span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">
                          Build a buffer fund to handle income variability
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl text-center border border-gray-200">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Select a target date to calculate required savings</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === "stability" && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Chart Section - Left Side */}
            <div className="lg:w-7/12 h-96">
              {incomeStabilityChartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeStabilityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      formatter={(value) => [`$${addThousandsSeparator(parseFloat(value).toFixed(2))}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px',
                        border: '1px solid #eee',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="savings" name="Savings" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {/* Content Section - Right Side */}
            <div className="lg:w-5/12">
              {incomeStability ? (
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl mb-8 border border-blue-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Income Stability Analysis</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-gray-600 text-sm mb-2">Average Monthly Income</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(incomeStability.avgIncome)}
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-gray-600 text-sm mb-2">Income Volatility</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {incomeStability.incomeVolatility ? incomeStability.incomeVolatility.toFixed(1) : '0'}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                      <p className="text-gray-600 text-sm mb-2">Income Stability</p>
                      <p className={`text-xl font-bold ${
                        incomeStability.stabilityLevel === 'stable' ? 'text-green-600' :
                        incomeStability.stabilityLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {incomeStability.stabilityLevel ? incomeStability.stabilityLevel.charAt(0).toUpperCase() + incomeStability.stabilityLevel.slice(1) : 'Unknown'} Income
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">Recommendations</h3>
                    <ul className="space-y-4">
                      {incomeStability.recommendations && incomeStability.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl text-center border border-gray-200">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Income history data needed for analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalPlanner;