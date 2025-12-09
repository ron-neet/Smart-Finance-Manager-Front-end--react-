import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import { calculateBudgetProgress, generateBudgetAlerts, suggestBudgetAdjustments, calculateBudgetHealth } from "../util/budgetPlanning";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Wallet, TrendingUp, AlertTriangle, Lightbulb, Plus, Target } from "lucide-react";

const Budget = () => {
    useUser();

    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [newBudget, setNewBudget] = useState({ categoryId: "", amount: "", period: "monthly" });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const fetchBudgets = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_BUDGETS);
            if (response.status === 200) {
                setBudgets(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Budget endpoint not found. Please contact your administrator.");
            } else {
                toast.error("Failed to fetch budgets. Please try again later.");
            }
        }
    };

    const fetchCategories = async () => {
        try {
            // Fetch only expense categories for budgets
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Categories endpoint not found. Please contact your administrator.");
            } else {
                toast.error("Failed to fetch categories. Please try again later.");
            }
        }
    };

    const fetchTransactions = async () => {
        try {
            const incomeResponse = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            const expenseResponse = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            
            if (incomeResponse.status === 200 && expenseResponse.status === 200) {
                const allTransactions = [
                    ...incomeResponse.data.map(t => ({ ...t, type: "income" })),
                    ...expenseResponse.data.map(t => ({ ...t, type: "expense" }))
                ];
                setTransactions(allTransactions);
            }
        } catch (error) {
            if (error.response && (error.response.status === 404 || error.response.status === 404)) {
                toast.error("Transactions endpoint not found. Please contact your administrator.");
            } else {
                toast.error("Failed to fetch transactions. Please try again later.");
            }
        }
    };

    const handleAddBudget = async () => {
        // Validate required fields
        if (!newBudget.categoryId || newBudget.categoryId === "") {
            toast.error("Please select a category");
            return;
        }

        if (!newBudget.amount) {
            toast.error("Please enter an amount");
            return;
        }

        // Validate amount
        const amount = parseFloat(newBudget.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Find the selected category (handle potential type mismatches)
        const category = categories.find(c => c.id == newBudget.categoryId);
        
        // Check if category exists
        if (!category) {
            toast.error("Please select a valid category");
            return;
        }
        
        try {
            const budgetData = {
                categoryId: newBudget.categoryId,
                categoryName: category.name,
                amount: amount,
                period: newBudget.period,
                isActive: true
            };

            const response = await axiosConfig.post(API_ENDPOINTS.ADD_BUDGET, budgetData);
            if (response.status === 200 || response.status === 201) {
                toast.success("Budget added successfully");
                setNewBudget({ categoryId: "", amount: "", period: "monthly" });
                fetchBudgets();
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Budget endpoint not found. Please contact your administrator.");
            } else if (error.response && error.response.status === 400) {
                toast.error("Invalid budget data. Please check your inputs.");
            } else {
                toast.error("Failed to add budget. Please try again later.");
            }
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        try {
            const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_BUDGET(budgetId));
            if (response.status === 200 || response.status === 204) {
                toast.success("Budget deleted successfully");
                fetchBudgets();
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Budget endpoint not found. Please contact your administrator.");
            } else {
                toast.error("Failed to delete budget. Please try again later.");
            }
        }
    };

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
        fetchTransactions();
    }, []);

    // Calculate budget data for visualization
    const budgetData = budgets.map(budget => {
        const spent = transactions
            .filter(t => t.categoryId === budget.categoryId && t.type === "expense")
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const progress = calculateBudgetProgress(spent, budget.amount);
        
        return {
            ...budget,
            spent,
            progress
        };
    });

    // Generate budget alerts
    const budgetAlerts = generateBudgetAlerts(budgets, transactions.filter(t => t.type === "expense"));

    // Calculate budget health
    const budgetHealth = calculateBudgetHealth(budgets, transactions.filter(t => t.type === "expense"));

    // Suggest budget adjustments
    const budgetSuggestions = suggestBudgetAdjustments(
        transactions.filter(t => t.type === "expense"), 
        budgets
    );

    // Prepare data for charts
    const chartData = budgetData.map(budget => ({
        name: budget.categoryName,
        budgeted: budget.amount,
        spent: budget.spent,
        remaining: budget.progress.remaining,
        progress: budget.progress
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div>
            <Dashboard activeMenu="Budget">
                <div className={`my-5 mx-auto transition-all duration-500 ease-in-out transform ${animate ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Budget Planning</h1>
                            <p className="text-gray-600 mt-2 text-lg">Set and track your spending limits</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <Target className="h-6 w-6 text-indigo-800" />
                            </div>
                            <div>
                                <p className="text-sm">Active Budgets</p>
                                <p className="text-2xl font-bold">{budgetData.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap border-b border-gray-200 mb-8">
                        <button
                            className={`py-4 px-8 font-bold text-base rounded-t-xl transition-all duration-300 ${
                                activeTab === "overview"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>
                        <button
                            className={`py-4 px-8 font-bold text-base rounded-t-xl transition-all duration-300 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveTab("manage")}
                        >
                            Manage Budgets
                        </button>
                        <button
                            className={`py-4 px-8 font-bold text-base rounded-t-xl transition-all duration-300 ${
                                activeTab === "alerts"
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveTab("alerts")}
                        >
                            Alerts & Suggestions
                        </button>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {/* Budget Health Score */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <Wallet className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Budget Health Overview</h2>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-base font-bold shadow-md">
                                        {budgetHealth.score >= 80 ? 'Excellent' : 
                                         budgetHealth.score >= 60 ? 'Good' : 
                                         budgetHealth.score >= 40 ? 'Fair' : 'Needs Attention'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-2xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 bg-purple-500 rounded-xl mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-gray-700">Health Score</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-purple-600">{budgetHealth.score}<span className="text-xl">/100</span></p>
                                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                                            <div 
                                                className={`h-3 rounded-full ${
                                                    budgetHealth.score >= 80 ? 'bg-green-500' : 
                                                    budgetHealth.score >= 60 ? 'bg-yellow-500' : 
                                                    'bg-red-500'
                                                }`} 
                                                style={{ width: `${budgetHealth.score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 bg-blue-500 rounded-xl mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9 7a1 1 0 100 2 1 1 0 000-2zM7 9a1 1 0 112 0v4a1 1 0 11-2 0V9z" />
                                                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 14V4h10v12H7z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-gray-700">On Track</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-blue-600">{budgetHealth.onTrackBudgets}<span className="text-xl text-gray-500">/{budgetHealth.totalBudgets}</span></p>
                                        <p className="text-sm text-gray-500 mt-2">Budgets performing well</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-teal-100 p-6 rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 bg-green-500 rounded-xl mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-gray-700">Total Budgeted</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-green-600">${(budgetHealth.totalBudgeted / 1000).toFixed(1)}<span className="text-xl">k</span></p>
                                        <p className="text-sm text-gray-500 mt-2">Monthly allocation</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 bg-amber-500 rounded-xl mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 13.047 14.01c-.04.3-.068.598-.068.99 0 1.105.895 2 2 2a2 2 0 002-2c0-.392-.028-.69-.068-.99L17.854 7.2 19.033 2.744A1 1 0 0018.2 2h-6.4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-gray-700">Total Spent</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-amber-600">${(budgetHealth.totalSpent / 1000).toFixed(1)}<span className="text-xl">k</span></p>
                                        <p className="text-sm text-gray-500 mt-2">This month</p>
                                    </div>
                                </div>
                            </div>

                            {/* Budget Visualization */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <TrendingUp className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Budget Visualization</h2>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 bg-indigo-500 rounded-full mr-2"></div>
                                            <span className="text-sm font-medium text-gray-600">Budgeted</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
                                            <span className="text-sm font-medium text-gray-600">Spent</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="h-96 min-h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-inner">
                                        <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">Budget vs Spending Comparison</h3>
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis 
                                                    dataKey="name" 
                                                    angle={-45} 
                                                    textAnchor="end" 
                                                    height={60}
                                                    tick={{ fontSize: 14, fontWeight: 'bold' }}
                                                />
                                                <YAxis 
                                                    tick={{ fontSize: 14, fontWeight: 'bold' }}
                                                    tickFormatter={(value) => `$${value}`}
                                                />
                                                <Tooltip 
                                                    formatter={(value) => [`$${value}`, 'Amount']}
                                                    contentStyle={{ 
                                                        backgroundColor: 'white', 
                                                        borderRadius: '0.75rem', 
                                                        border: '1px solid #e5e7eb',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                                    }}
                                                />
                                                <Bar dataKey="budgeted" fill="#818cf8" name="Budgeted" radius={[6, 6, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell 
                                                            key={`cell-${index}`} 
                                                            fill={entry.progress.percentage > 100 ? '#f87171' : '#818cf8'}
                                                        />
                                                    ))}
                                                </Bar>
                                                <Bar dataKey="spent" fill="#34d399" name="Spent" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="h-96 min-h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-inner">
                                        <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">Spending Distribution</h3>
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="spent"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell 
                                                            key={`cell-${index}`} 
                                                            fill={COLORS[index % COLORS.length]} 
                                                            stroke="#fff"
                                                            strokeWidth={3}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(value) => [`$${value}`, 'Amount']}
                                                    contentStyle={{ 
                                                        backgroundColor: 'white', 
                                                        borderRadius: '0.75rem', 
                                                        border: '1px solid #e5e7eb',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Budgets Tab */}
                    {activeTab === "manage" && (
                        <div className="space-y-8">
                            {/* Add New Budget */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-100 rounded-xl">
                                            <Plus className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Create New Budget</h2>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-base font-bold shadow-md">
                                        Set spending limits
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-base font-bold text-gray-700">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                                Category
                                            </div>
                                        </label>
                                        <select
                                            value={newBudget.categoryId}
                                            onChange={(e) => setNewBudget({...newBudget, categoryId: e.target.value})}
                                            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-base font-bold text-gray-700">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                                                Amount ($)
                                            </div>
                                        </label>
                                        <input
                                            type="number"
                                            value={newBudget.amount}
                                            onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                                            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-base font-bold text-gray-700">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                Period
                                            </div>
                                        </label>
                                        <select
                                            value={newBudget.period}
                                            onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                                            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={handleAddBudget}
                                            className="w-full px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center font-bold"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add Budget
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Budget List */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-100 rounded-xl">
                                            <Wallet className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Your Budgets</h2>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-base font-bold shadow-md">
                                        {budgetData.length} active
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {budgetData.length > 0 ? (
                                        budgetData.map(budget => (
                                            <div key={budget.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 shadow-sm">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-gray-800">{budget.categoryName}</h3>
                                                        <div className="flex items-center mt-2">
                                                            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                                                                budget.progress.status === 'exceeded' ? 'bg-red-100 text-red-800' :
                                                                budget.progress.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                                budget.progress.status === 'caution' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {budget.progress.status === 'exceeded' ? 'Over budget' :
                                                                 budget.progress.status === 'warning' ? 'Warning' :
                                                                 budget.progress.status === 'caution' ? 'Approaching limit' : 'On track'}
                                                            </span>
                                                            <span className="ml-3 text-base text-gray-600 font-medium">{budget.progress.percentage}% used</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteBudget(budget.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-full hover:bg-red-50"
                                                        title="Delete budget"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                                                        <p className="text-sm text-indigo-600 font-bold">Budgeted</p>
                                                        <p className="text-2xl font-bold text-indigo-700">${budget.amount.toFixed(2)}</p>
                                                    </div>
                                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                                                        <p className="text-sm text-emerald-600 font-bold">Spent</p>
                                                        <p className="text-2xl font-bold text-emerald-700">${budget.spent.toFixed(2)}</p>
                                                    </div>
                                                    <div className={`p-4 rounded-xl border shadow-sm ${budget.progress.remaining < 0 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                                                        <p className="text-sm font-bold" style={{ color: budget.progress.remaining < 0 ? '#dc2626' : '#d97706' }}>
                                                            {budget.progress.remaining < 0 ? 'Over by' : 'Remaining'}
                                                        </p>
                                                        <p className="text-2xl font-bold" style={{ color: budget.progress.remaining < 0 ? '#dc2626' : '#d97706' }}>
                                                            ${Math.abs(budget.progress.remaining).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-4">
                                                    <div
                                                        className={`h-4 rounded-full ${
                                                            budget.progress.status === 'exceeded' ? 'bg-red-500' :
                                                            budget.progress.status === 'warning' ? 'bg-yellow-500' :
                                                            budget.progress.status === 'caution' ? 'bg-amber-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min(budget.progress.percentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-2xl font-bold text-gray-700 mb-3">No budgets yet</h3>
                                            <p className="text-gray-500 mb-6 text-lg">Start by creating your first budget to track your spending.</p>
                                            <button 
                                                onClick={() => setActiveTab("manage")}
                                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg transform hover:-translate-y-1"
                                            >
                                                Create Budget
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alerts & Suggestions Tab */}
                    {activeTab === "alerts" && (
                        <div className="space-y-8">
                            {/* Budget Alerts */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-red-100 rounded-xl">
                                            <AlertTriangle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Budget Alerts</h2>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-base font-bold shadow-md">
                                        {budgetAlerts.length} alerts
                                    </div>
                                </div>
                                {budgetAlerts.length > 0 ? (
                                    <div className="space-y-5">
                                        {budgetAlerts.map((alert, index) => (
                                            <div 
                                                key={index} 
                                                className={`p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                                                    alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                                                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                                    'border-amber-500 bg-amber-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-start">
                                                        <div className={`p-3 rounded-xl mr-5 ${
                                                            alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                                                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                            'bg-amber-100 text-amber-600'
                                                        }`}>
                                                            <AlertTriangle className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-xl text-gray-800">{alert.message}</h3>
                                                            <p className="text-base text-gray-600 mt-2">Take action to avoid overspending in this category.</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-4 py-2 rounded-full text-base font-bold ${
                                                        alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                                                        alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                        'bg-amber-200 text-amber-800'
                                                    }`}>
                                                        {alert.severity === 'high' ? 'Critical' : 
                                                         alert.severity === 'medium' ? 'Warning' : 'Notice'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-3">All budgets are on track!</h3>
                                        <p className="text-gray-500 text-lg">Great job managing your finances. No alerts at this time.</p>
                                    </div>
                                )}
                            </div>

                            {/* Budget Suggestions */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 rounded-xl">
                                            <Lightbulb className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Budget Suggestions</h2>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-base font-bold shadow-md">
                                        {budgetSuggestions.length} suggestions
                                    </div>
                                </div>
                                {budgetSuggestions.length > 0 ? (
                                    <div className="space-y-5">
                                        {budgetSuggestions.map((suggestion, index) => (
                                            <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 shadow-sm">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-gray-800">{suggestion.categoryName}</h3>
                                                        <div className="flex items-center mt-2">
                                                            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                                                                suggestion.action === 'increase' ? 'bg-red-100 text-red-800' :
                                                                suggestion.action === 'decrease' ? 'bg-green-100 text-green-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {suggestion.action === 'increase' ? 'Increase Recommended' : 
                                                                 suggestion.action === 'decrease' ? 'Decrease Recommended' : 
                                                                 'Adjust Recommended'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`p-4 rounded-xl ${
                                                        suggestion.difference > 0 ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'
                                                    }`}>
                                                        <p className="text-sm text-gray-600 font-bold">Difference</p>
                                                        <p className={`text-2xl font-bold ${suggestion.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {suggestion.difference > 0 ? '+' : ''}${Math.abs(suggestion.difference).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                                                        <p className="text-sm text-indigo-600 font-bold">Current Budget</p>
                                                        <p className="text-2xl font-bold text-indigo-700">${suggestion.currentBudget.toFixed(2)}</p>
                                                    </div>
                                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                                                        <p className="text-sm text-blue-600 font-bold">Suggested Budget</p>
                                                        <p className="text-2xl font-bold text-blue-700">${suggestion.suggestedBudget.toFixed(2)}</p>
                                                    </div>
                                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
                                                        <p className="text-sm text-amber-600 font-bold">Change Required</p>
                                                        <p className="text-2xl font-bold text-amber-700">{Math.abs(suggestion.percentageChange)}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-base text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    <Lightbulb className="h-5 w-5 mr-3 text-blue-500" />
                                                    Based on your spending history, we recommend 
                                                    {suggestion.action === 'increase' ? ' increasing' : 
                                                     suggestion.action === 'decrease' ? ' decreasing' : 
                                                     ' setting'} your budget by {Math.abs(suggestion.percentageChange)}% for better financial alignment.
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-blue-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No suggestions at this time</h3>
                                        <p className="text-gray-500 text-lg">Your budgets are well-aligned with your spending patterns.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    );
};

export default Budget;