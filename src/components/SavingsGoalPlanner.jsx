import React, { useState, useEffect } from "react";
import { calculateSavingsProjection, calculateRequiredSavings, analyzeIncomeStability } from "../util/savingsInvestment";
import { addThousandsSeparator } from "../util/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { Target, TrendingUp, TrendingDown, Calendar, DollarSign, PiggyBank, Plus, Trash2, Edit2, CheckCircle, Award, Zap, ArrowRight, X } from "lucide-react";
import toast from "react-hot-toast";

const SavingsGoalPlanner = ({ totalBalance, incomeHistory, expenseHistory }) => {
  // Multiple savings goals
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', targetAmount: 10000, currentAmount: 3500, color: '#7c3aed', icon: '🛡️', priority: 'high' },
    { id: 2, name: 'Vacation', targetAmount: 5000, currentAmount: 1200, color: '#10b981', icon: '✈️', priority: 'medium' },
    { id: 3, name: 'New Car', targetAmount: 25000, currentAmount: 5000, color: '#f59e0b', icon: '🚗', priority: 'low' }
  ]);

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: 0, color: '#7c3aed', icon: '🎯', priority: 'medium' });
  const [showMilestoneCelebration, setShowMilestoneCelebration] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState('');

  // Existing state
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [targetDate, setTargetDate] = useState("");
  const [projection, setProjection] = useState(null);
  const [requiredSavings, setRequiredSavings] = useState(null);
  const [incomeStability, setIncomeStability] = useState(null);
  const [projectionType, setProjectionType] = useState("average");
  const [activeTab, setActiveTab] = useState("projection");

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

  // Check for milestone achievements
  useEffect(() => {
    goals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const milestones = [25, 50, 75, 100];

      milestones.forEach(milestone => {
        if (Math.abs(progress - milestone) < 1 && progress >= milestone) {
          const hasCelebrated = localStorage.getItem(`milestone_${goal.id}_${milestone}`);
          if (!hasCelebrated) {
            celebrateMilestone(goal, milestone);
            localStorage.setItem(`milestone_${goal.id}_${milestone}`, 'true');
          }
        }
      });
    });
  }, [goals]);

  const celebrateMilestone = (goal, percentage) => {
    const messages = [
      `🎉 Amazing! You've reached ${percentage}% of your ${goal.name} goal!`,
      `🏆 Milestone unlocked! ${percentage}% complete for ${goal.name}!`,
      `✨ Incredible progress! ${percentage}% of ${goal.name} achieved!`,
      `💪 You're crushing it! ${percentage}% toward ${goal.name}!`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMilestoneMessage(randomMessage);
    setShowMilestoneCelebration(true);
    toast.success(randomMessage, { duration: 4000, icon: '🎊' });

    setTimeout(() => setShowMilestoneCelebration(false), 5000);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal = {
      ...newGoal,
      id: Date.now(),
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount)
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: '', currentAmount: 0, color: '#7c3aed', icon: '🎯', priority: 'medium' });
    setShowAddGoalModal(false);
    toast.success('Savings goal added successfully! 🎯');
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal(goal);
    setShowAddGoalModal(true);
  };

  const handleUpdateGoal = () => {
    const updatedGoals = goals.map(g =>
      g.id === editingGoal.id ? { ...newGoal, targetAmount: Number(newGoal.targetAmount), currentAmount: Number(newGoal.currentAmount) } : g
    );
    setGoals(updatedGoals);
    setEditingGoal(null);
    setNewGoal({ name: '', targetAmount: '', currentAmount: 0, color: '#7c3aed', icon: '🎯', priority: 'medium' });
    setShowAddGoalModal(false);
    toast.success('Goal updated successfully! ✨');
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
    toast.success('Goal deleted');
  };

  const handleLinkTransaction = (goalId, amount) => {
    const updatedGoals = goals.map(g =>
      g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
    );
    setGoals(updatedGoals);
    toast.success(`$${amount} linked to goal! 💰`);
  };

  const calculateMonthlyContribution = (goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const projection = calculateSavingsProjection(
      totalBalance || 0,
      incomeHistory,
      expenseHistory,
      remaining,
      'average'
    );
    return projection?.monthlySavings || 0;
  };

  const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6'];

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
      {/* Milestone Celebration Overlay */}
      {showMilestoneCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 animate-pulse"></div>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform animate-bounce pointer-events-auto border-4 border-purple-500">
            <div className="text-center">
              <Award className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-purple-600 mb-2">{milestoneMessage}</h2>
              <p className="text-gray-600">Keep up the great work!</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 mb-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-purple-100 rounded-2xl">
                <Target className="text-purple-600" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Savings Goals Tracker</h2>
                <p className="text-gray-600 text-lg mt-2">
                  Track multiple savings goals and celebrate your progress
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <DollarSign size={24} className="text-indigo-800" />
              </div>
              <div>
                <p className="text-base">Current Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(displayBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multiple Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {goals.map((goal, index) => {
          const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
          const remaining = goal.targetAmount - goal.currentAmount;
          const monthlyContribution = calculateMonthlyContribution(goal);

          return (
            <div key={goal.id} className="bg-white rounded-3xl shadow-xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105" style={{ borderColor: goal.color }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{goal.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                      }`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditGoal(goal)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-600">Progress</span>
                  <span className="font-bold text-gray-800">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Saved</p>
                  <p className="text-lg font-bold" style={{ color: goal.color }}>{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Target</p>
                  <p className="text-lg font-bold text-gray-800">{formatCurrency(goal.targetAmount)}</p>
                </div>
              </div>

              {/* Remaining & Suggestion */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-lg font-bold text-gray-800">{formatCurrency(remaining)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap size={16} className="text-yellow-500" />
                  <span className="text-gray-600">Suggested:</span>
                  <span className="font-bold text-green-600">{formatCurrency(monthlyContribution)}/month</span>
                </div>
              </div>

              {/* Link Transaction Button */}
              <button
                onClick={() => handleLinkTransaction(goal.id, 100)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Link $100 Transaction
              </button>
            </div>
          );
        })}

        {/* Add New Goal Card */}
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-xl p-6 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Plus size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Add New Goal</h3>
          <p className="text-gray-600 text-center">Create a new savings goal to track</p>
        </button>
      </div>
      {/* Add/Edit Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingGoal ? 'Edit Goal' : 'Add New Savings Goal'}
              </h2>
              <button onClick={() => setShowAddGoalModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Goal Name *</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund, Vacation, Car"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount ($) *</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="10000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Amount ($)</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-3">
                  {['high', 'medium', 'low'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => setNewGoal({ ...newGoal, priority })}
                      className={`py-3 rounded-xl font-semibold transition-all ${newGoal.priority === priority
                          ? priority === 'high'
                            ? 'bg-red-500 text-white shadow-lg'
                            : priority === 'medium'
                              ? 'bg-yellow-500 text-white shadow-lg'
                              : 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewGoal({ ...newGoal, color })}
                      className={`w-10 h-10 rounded-full transition-all transform ${newGoal.color === color ? 'scale-125 ring-4 ring-offset-2' : ''
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddGoalModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goals Summary Pie Chart */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <PieChart size={28} className="text-purple-600" />
          Goals Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goals.map(g => ({ name: g.name, value: g.currentAmount, color: g.color }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            {goals.map(goal => {
              const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
              return (
                <div key={goal.id} className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: goal.color }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-gray-700">{goal.name}</span>
                      <span className="font-bold text-gray-800">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: goal.color }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-10">
        <button
          className={`py-5 px-10 font-bold text-lg rounded-t-2xl transition-all duration-300 ${activeTab === "projection"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          onClick={() => setActiveTab("projection")}
        >
          Time Projection
        </button>
        <button
          className={`py-5 px-10 font-bold text-lg rounded-t-2xl transition-all duration-300 ${activeTab === "required"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          onClick={() => setActiveTab("required")}
        >
          Required Savings
        </button>
        <button
          className={`py-5 px-10 font-bold text-lg rounded-t-2xl transition-all duration-300 ${activeTab === "stability"
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
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Chart Section - Left Side */}
            <div className="lg:w-7/12 h-[400px]">
              {projectionChartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" stroke="#666" fontSize={14} fontWeight="bold" />
                    <YAxis stroke="#666" fontSize={14} fontWeight="bold" />
                    <Tooltip
                      formatter={(value) => [`$${addThousandsSeparator(parseFloat(value).toFixed(2))}`, 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        border: '1px solid #eee',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      name="Projected Savings"
                      stroke="#7c3aed"
                      strokeWidth={4}
                      dot={{ r: 8, fill: '#7c3aed' }}
                      activeDot={{ r: 10, stroke: '#7c3aed', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="goal"
                      name="Savings Goal"
                      stroke="#10b981"
                      strokeWidth={4}
                      strokeDasharray="6 6"
                      dot={{ r: 8, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Content Section - Right Side */}
            <div className="lg:w-5/12">
              {/* Projection Type Selector */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-5">Projection Type</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    className={`px-6 py-4 text-base rounded-2xl font-bold transition-all duration-300 shadow-lg ${projectionType === "conservative"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    onClick={() => handleProjectionTypeChange("conservative")}
                  >
                    Conservative
                  </button>
                  <button
                    className={`px-6 py-4 text-base rounded-2xl font-bold transition-all duration-300 shadow-lg ${projectionType === "average"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    onClick={() => handleProjectionTypeChange("average")}
                  >
                    Average
                  </button>
                  <button
                    className={`px-6 py-4 text-base rounded-2xl font-bold transition-all duration-300 shadow-lg ${projectionType === "optimistic"
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
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-7 rounded-3xl mb-10 border border-purple-100 shadow-lg">
                    <h3 className="font-bold text-gray-800 text-xl mb-5">Projection Summary</h3>
                    {projection.isAchievable ? (
                      <div className="flex items-end gap-4 mb-8">
                        <p className="text-5xl font-bold text-purple-600">
                          {projection.monthsToGoal}
                        </p>
                        <div>
                          <p className="text-2xl font-bold">months</p>
                          <p className="text-gray-600 text-lg">({projection.yearsToGoal} years)</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-600 font-bold text-xl mb-6">
                        Current spending exceeds income. Goal not achievable without changes.
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-5">
                      <div className="bg-white p-5 rounded-2xl text-center shadow-md">
                        <p className="text-gray-600 text-base mb-2">Min/Month</p>
                        <p className="font-bold text-red-500 text-xl">{formatCurrency(projection.minSavings)}</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl text-center shadow-md">
                        <p className="text-gray-600 text-base mb-2">Average</p>
                        <p className="font-bold text-yellow-500 text-xl">{formatCurrency(projection.averageSavings)}</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl text-center shadow-md">
                        <p className="text-gray-600 text-base mb-2">Max/Month</p>
                        <p className="font-bold text-green-500 text-xl">{formatCurrency(projection.maxSavings)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-5">Recommendations</h3>
                    <ul className="space-y-5">
                      {projection.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex-shrink-0 mt-2 mr-4">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-gray-700 text-lg">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-3xl text-center border border-gray-200">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-2xl w-20 h-20 mx-auto mb-6 shadow-md"></div>
                  <p className="text-gray-500 font-bold text-lg">Enter your financial details to see projections</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "required" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            {/* Goal Amount Input */}
            <div className="mb-8">
              <label className="block text-base font-bold text-gray-800 mb-4">
                Savings Goal Amount ($)
              </label>
              <div className="relative max-w-md">
                <input
                  type="number"
                  value={savingsGoal}
                  onChange={handleGoalChange}
                  placeholder="10000"
                  className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 text-xl shadow-sm transition-all hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <DollarSign className="text-gray-400" size={24} />
                </div>
              </div>
            </div>

            {/* Target Date Input */}
            <div className="mb-10">
              <label className="block text-base font-bold text-gray-800 mb-4">
                Target Date
              </label>
              <div className="relative max-w-md">
                <input
                  type="date"
                  value={targetDate}
                  onChange={handleDateChange}
                  className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 text-xl shadow-sm transition-all hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <Calendar className="text-gray-400" size={24} />
                </div>
              </div>
            </div>

            {requiredSavings ? (
              <div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-7 rounded-3xl mb-10 border border-green-100 shadow-lg">
                  <h3 className="font-bold text-gray-800 text-xl mb-5">Required Savings</h3>
                  {requiredSavings.isFeasible ? (
                    <div className="flex items-end gap-4 mb-6">
                      <p className="text-5xl font-bold text-green-600">
                        {formatCurrency(requiredSavings.requiredMonthlySavings)}
                      </p>
                      <p className="text-2xl text-gray-600">per month</p>
                    </div>
                  ) : (
                    <p className="text-red-600 font-bold text-xl mb-6">{requiredSavings.message}</p>
                  )}
                  <p className="text-gray-600 text-lg">
                    For {requiredSavings.monthsUntilTarget} months • Income volatility: {requiredSavings.incomeVolatility ? requiredSavings.incomeVolatility.toFixed(1) : '0'}%
                  </p>
                </div>

                {requiredSavings.isFeasible && (
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-5">Tips to Reach Your Goal</h3>
                    <ul className="space-y-5">
                      <li className="flex items-start bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 mt-2 mr-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700 text-lg">
                          Set up an automatic transfer to your savings account during high-income periods
                        </span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 mt-2 mr-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700 text-lg">
                          During peak earning months, save extra to compensate for leaner months
                        </span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 mt-2 mr-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700 text-lg">
                          Build a buffer fund to handle income variability
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-3xl text-center border border-gray-200">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-2xl w-20 h-20 mx-auto mb-6 shadow-md"></div>
                <p className="text-gray-500 font-bold text-lg">Select a target date to calculate required savings</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "stability" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Chart Section - Left Side */}
            <div className="lg:w-7/12 h-[400px]">
              {incomeStabilityChartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeStabilityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" stroke="#666" fontSize={14} fontWeight="bold" />
                    <YAxis stroke="#666" fontSize={14} fontWeight="bold" />
                    <Tooltip
                      formatter={(value) => [`$${addThousandsSeparator(parseFloat(value).toFixed(2))}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        border: '1px solid #eee',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="savings" name="Savings" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Content Section - Right Side */}
            <div className="lg:w-5/12">
              {incomeStability ? (
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-7 rounded-3xl mb-10 border border-blue-100 shadow-lg">
                    <h3 className="font-bold text-gray-800 text-xl mb-5">Income Stability Analysis</h3>
                    <div className="grid grid-cols-2 gap-5 mb-8">
                      <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-gray-600 text-base mb-3">Average Monthly Income</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(incomeStability.avgIncome)}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-gray-600 text-base mb-3">Income Volatility</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {incomeStability.incomeVolatility ? incomeStability.incomeVolatility.toFixed(1) : '0'}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                      <p className="text-gray-600 text-base mb-3">Income Stability</p>
                      <p className={`text-2xl font-bold ${incomeStability.stabilityLevel === 'stable' ? 'text-green-600' :
                          incomeStability.stabilityLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {incomeStability.stabilityLevel ? incomeStability.stabilityLevel.charAt(0).toUpperCase() + incomeStability.stabilityLevel.slice(1) : 'Unknown'} Income
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-5">Recommendations</h3>
                    <ul className="space-y-5">
                      {incomeStability.recommendations && incomeStability.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex-shrink-0 mt-2 mr-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-gray-700 text-lg">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-3xl text-center border border-gray-200">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-2xl w-20 h-20 mx-auto mb-6 shadow-md"></div>
                  <p className="text-gray-500 font-bold text-lg">Income history data needed for analysis</p>
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