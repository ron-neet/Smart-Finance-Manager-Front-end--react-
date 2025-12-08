import { Coins, Wallet, WalletCards, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, PiggyBank, Target } from "lucide-react";
import Dashboard from "../components/Dashboard";
import InfoCard from "../components/InfoCard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { addThousandsSeparator } from "../util/utils.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoint.js";
import RecentTransaction from "../components/RecentTransaction.jsx";
import FinanceOverView from "../components/FinanceOverView.jsx";
import Transactions from "../components/Transactions.jsx";
import BudgetForecast from "../components/BudgetForecast.jsx";
import { generateFinancialRecommendations, detectUnusualSpending } from "../util/aiPredictions.js";

const Home = () => {
    useUser();

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_DASHBOARD_DATA);
            if (response.status === 200) {
                setDashboardData(response.data);
            } else {
                toast.error("Failed to fetch Dashboard Data");
            }

        } catch (err) {
            toast.error("Failed to fetch Dashboard Data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Calculate financial metrics
    const totalBalance = dashboardData?.TotalBalance || 0;
    const totalIncome = dashboardData?.LatestIncome || 0;
    const totalExpense = dashboardData?.latestExpense || 0;
    const netCashFlow = totalIncome - totalExpense;

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
                        <p className="text-gray-600">Here's what's happening with your finances today</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : dashboardData ? (
                        <>
                            {/* Financial Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white border border-purple-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm font-medium">Total Balance</p>
                                            <h3 className="text-2xl font-bold mt-1">${addThousandsSeparator(totalBalance)}</h3>
                                        </div>
                                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                            <WalletCards className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                                        <span className="text-xs text-green-300">+2.5% from last month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white border border-green-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm font-medium">Total Income</p>
                                            <h3 className="text-2xl font-bold mt-1">${addThousandsSeparator(totalIncome)}</h3>
                                        </div>
                                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                                        <span className="text-xs text-green-300">+5.2% from last month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl shadow-xl p-6 text-white border border-rose-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-rose-100 text-sm font-medium">Total Expenses</p>
                                            <h3 className="text-2xl font-bold mt-1">${addThousandsSeparator(totalExpense)}</h3>
                                        </div>
                                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                            <TrendingDown className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingDown className="h-4 w-4 text-rose-200 mr-1" />
                                        <span className="text-xs text-rose-200">+1.8% from last month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white border border-amber-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-amber-100 text-sm font-medium">Net Cash Flow</p>
                                            <h3 className={`text-2xl font-bold mt-1 ${netCashFlow >= 0 ? 'text-green-100' : 'text-rose-100'}`}>
                                                ${addThousandsSeparator(Math.abs(netCashFlow))}
                                            </h3>
                                        </div>
                                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                            <Target className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        {netCashFlow >= 0 ? (
                                            <>
                                                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                                                <span className="text-xs text-green-300">Positive cash flow</span>
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="h-4 w-4 text-rose-200 mr-1" />
                                                <span className="text-xs text-rose-200">Negative cash flow</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Charts and Transactions Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Financial Overview Chart */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
                                        <div className="flex space-x-2">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                <span className="text-sm text-gray-600">Income</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                                                <span className="text-sm text-gray-600">Expenses</span>
                                            </div>
                                        </div>
                                    </div>
                                    <FinanceOverView
                                        totalBalance={totalBalance}
                                        totalIncome={totalIncome}
                                        totalExpense={totalExpense}
                                    />
                                </div>

                                {/* Recent Transactions */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                                        <button 
                                            onClick={() => navigate("/expense")}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                                        >
                                            View All
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <RecentTransaction
                                        transactions={dashboardData?.recent5TransactionList || []}
                                        onMore={() => navigate("/expense")}
                                    />
                                </div>
                            </div>

                            {/* Detailed Transactions */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Recent Expenses</h2>
                                        <button 
                                            onClick={() => navigate("/expense")}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <Transactions 
                                        title="Recent Expenses"
                                        transactions={dashboardData?.recent5Expense || []}
                                        onMore={() => navigate("/expense")}
                                        type="expense"
                                    />
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Recent Income</h2>
                                        <button 
                                            onClick={() => navigate("/income")}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <Transactions 
                                        title="Recent Income"
                                        transactions={dashboardData?.recent5Income || []}
                                        onMore={() => navigate("/income")}
                                        type="income"
                                    />
                                </div>
                            </div>

                            {/* AI Insights Section */}
                            {dashboardData && (
                                <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">AI-Powered Insights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Financial Recommendations */}
                                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="p-2 bg-purple-500 rounded-lg">
                                                    <Lightbulb className="text-white" size={24} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">Smart Recommendations</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                        </div>
                                                        <p className="text-gray-700 ml-3">Based on your spending patterns, we recommend increasing your emergency fund to 3-6 months of expenses.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                        </div>
                                                        <p className="text-gray-700 ml-3">Consider setting up automatic transfers to your savings account to boost your savings rate.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/planning')}
                                                className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium"
                                            >
                                                <PiggyBank className="mr-2" size={18} />
                                                View All Recommendations
                                            </button>
                                        </div>

                                        {/* Unusual Spending Alerts */}
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 shadow-lg">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="p-2 bg-amber-500 rounded-lg">
                                                    <AlertTriangle className="text-white" size={24} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">Spending Alerts</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        </div>
                                                        <p className="text-gray-700 ml-3">No unusual spending detected. Your transactions look normal.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/filter')}
                                                className="mt-5 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center font-medium"
                                            >
                                                <Target className="mr-2" size={18} />
                                                Review Transactions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg p-8">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No data available</h3>
                            <p className="text-gray-500">We couldn't load your dashboard data at the moment</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Home;