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
import SmartInsights from "../components/SmartInsights.jsx";
import { generateFinancialRecommendations, detectUnusualSpending, calculatePredictiveAlerts, calculateTrendAnalysis } from "../util/aiPredictions.js";
import { calculateFinancialHealthScore } from "../util/forecasting.js";
import { Brain, ArrowRight } from "lucide-react";

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

    // AI Insights Data - Safe Calculation
    let predictiveAlerts = [];
    let trendAnalysis = null;
    
    try {
        if (dashboardData) {
            predictiveAlerts = calculatePredictiveAlerts(dashboardData.budgetPerformance || []);
            trendAnalysis = calculateTrendAnalysis(dashboardData.spendingHistory || []);
        }
    } catch (err) {
        console.error("Critical Analysis Error:", err);
        // Fallback to empty states to prevent UI crash
    }

    // Financial Health Calculation
    const healthScore = dashboardData ? calculateFinancialHealthScore([...(dashboardData.recent5Income || []), ...(dashboardData.recent5Expense || [])]) : { score: 50, breakdown: {} };

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto max-w-7xl">
                    {/* Welcome Header */}
                    <div className="mb-10">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4">Welcome back!</h1>
                        <p className="text-gray-600 text-xl font-medium">Here's what's happening with your finances today</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 shadow-lg"></div>
                        </div>
                    ) : dashboardData ? (
                        <>
                            {/* Financial Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                                <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white border-2 border-purple-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-base font-bold">Total Balance</p>
                                            <h3 className="text-4xl font-bold mt-3">${addThousandsSeparator(totalBalance)}</h3>
                                        </div>
                                        <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                            <WalletCards className="h-10 w-10 text-indigo-800" />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center">
                                        <TrendingUp className="h-6 w-6 text-green-300 mr-2" />
                                        <span className="text-base text-green-300 font-medium">+2.5% from last month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white border-2 border-green-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-base font-bold">Total Income</p>
                                            <h3 className="text-4xl font-bold mt-3">${addThousandsSeparator(totalIncome)}</h3>
                                        </div>
                                        <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                            <TrendingUp className="h-10 w-10 text-indigo-800" />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center">
                                        <TrendingUp className="h-6 w-6 text-green-300 mr-2" />
                                        <span className="text-base text-green-300 font-medium">+5.2% from last month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-red-700 rounded-3xl shadow-2xl p-8 text-white border-2 border-rose-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-rose-100 text-base font-bold">Total Expenses</p>
                                            <h3 className="text-4xl font-bold mt-3">${addThousandsSeparator(totalExpense)}</h3>
                                        </div>
                                        <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                            <TrendingDown className="h-10 w-10 text-indigo-800" />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center">
                                        <TrendingDown className="h-6 w-6 text-rose-200 mr-2" />
                                        <span className="text-base text-rose-200 font-medium">+1.8% from last month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl shadow-2xl p-8 text-white border-2 border-amber-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-amber-100 text-base font-bold">Net Cash Flow</p>
                                            <h3 className={`text-4xl font-bold mt-3 ${netCashFlow >= 0 ? 'text-green-100' : 'text-rose-100'}`}>
                                                ${addThousandsSeparator(Math.abs(netCashFlow))}
                                            </h3>
                                        </div>
                                        <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                            <Target className="h-10 w-10 text-indigo-800" />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center">
                                        {netCashFlow >= 0 ? (
                                            <>
                                                <TrendingUp className="h-6 w-6 text-green-300 mr-2" />
                                                <span className="text-base text-green-300 font-medium">Positive cash flow</span>
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="h-6 w-6 text-rose-200 mr-2" />
                                                <span className="text-base text-rose-200 font-medium">Negative cash flow</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Smart AI Financial Insights */}
                            {(predictiveAlerts.length > 0 || trendAnalysis) && (
                                <div className="mb-10">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
                                        Predictive Intelligence
                                    </h2>
                                    <SmartInsights 
                                        predictiveAlerts={predictiveAlerts} 
                                        trendAnalysis={trendAnalysis} 
                                    />
                                </div>
                            )}

                            {/* Charts and Transactions Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                {/* Financial Overview Chart */}
                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100 hover:shadow-3xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Financial Overview</h2>
                                        <div className="flex space-x-4">
                                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                                                <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md"></div>
                                                <span className="text-sm font-bold text-gray-700">Income</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl">
                                                <div className="w-3 h-3 bg-gradient-to-br from-rose-500 to-red-600 rounded-full shadow-md"></div>
                                                <span className="text-sm font-bold text-gray-700">Expenses</span>
                                            </div>
                                        </div>
                                    </div>
                                    <FinanceOverView
                                        totalBalance={totalBalance}
                                        totalIncome={totalIncome}
                                        totalExpense={totalExpense}
                                        spendingHistory={dashboardData?.spendingHistory || []}
                                    />
                                </div>

                                {/* Recent Transactions */}
                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100 hover:shadow-3xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Recent Transactions</h2>
                                        <button 
                                            onClick={() => navigate("/expense")}
                                            className="text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold flex items-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                        >
                                            View All
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100 hover:shadow-3xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Recent Expenses</h2>
                                        <button 
                                            onClick={() => navigate("/expense")}
                                            className="text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
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

                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100 hover:shadow-3xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Recent Income</h2>
                                        <button 
                                            onClick={() => navigate("/income")}
                                            className="text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
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
                                <div className="mt-10">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">AI-Powered Insights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Financial Recommendations */}
                                        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-4 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                                    <Lightbulb className="text-white" size={32} />
                                                </div>
                                                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Smart Recommendations</h3>
                                            </div>
                                            <div className="space-y-5">
                                                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-md"></div>
                                                        </div>
                                                        <p className="text-gray-700 ml-4 font-medium text-lg">Based on your spending patterns, we recommend increasing your emergency fund to 3-6 months of expenses.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-md"></div>
                                                        </div>
                                                        <p className="text-gray-700 ml-4 font-medium text-lg">Consider setting up automatic transfers to your savings account to boost your savings rate.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/planning')}
                                                className="mt-8 w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                                            >
                                                <PiggyBank className="mr-3" size={22} />
                                                View All Recommendations
                                            </button>
                                        </div>

                                        {/* Unusual Spending Alerts */}
                                        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-amber-200 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-4 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                                    <AlertTriangle className="text-white" size={32} />
                                                </div>
                                                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Spending Alerts</h3>
                                            </div>
                                            <div className="space-y-5">
                                                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border-2 border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md"></div>
                                                        </div>
                                                        <p className="text-gray-700 ml-4 font-medium text-lg">No unusual spending detected. Your transactions look normal.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/filter')}
                                                className="mt-8 w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                                            >
                                                <Target className="mr-3" size={22} />
                                                Review Transactions
                                            </button>
                                        </div>
                                    </div>

                                    {/* Financial Health Score (Moved Below) */}
                                    <div className="mt-10">
                                        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                                            Financial Health
                                        </h2>
                                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 border-2 border-purple-100 shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col md:flex-row items-center gap-12">
                                            <div className="relative inline-flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full">
                                                <Brain className="text-purple-600 opacity-10 absolute" size={180} />
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <span className={`text-8xl font-black ${healthScore.score >= 70 ? 'text-emerald-500' : healthScore.score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                        {healthScore.score}
                                                    </span>
                                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Vitality Score</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 text-center md:text-left">
                                                <h3 className="text-4xl font-bold text-gray-800 mb-4">
                                                    {healthScore.score >= 70 ? "Your financial lungs are strong!" : healthScore.score >= 40 ? "Steady heartbeat, keep it up." : "Needs immediate attention."}
                                                </h3>
                                                <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8 max-w-2xl">
                                                    {healthScore.score >= 70 
                                                        ? "You are saving over 20% of your income and your expense management is in the top decile. This score reflects an excellent balance between life and savings." 
                                                        : healthScore.score >= 40 
                                                            ? "You have a stable income flow, but your expense ratio is slightly elevated. Consider trimming non-essential subscriptions to boost your vitality score." 
                                                            : "Your debt-to-income ratio and spending velocity suggest a high cash burn rate. Focus on 'Needs' only for the next 30 days to recover."}
                                                </p>
                                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                                    <button 
                                                        onClick={() => navigate('/forecast')}
                                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-2 group"
                                                    >
                                                        See 6-Month Projection
                                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate('/planning')}
                                                        className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-100 rounded-2xl font-bold hover:bg-purple-50 transition-all"
                                                    >
                                                        Improve My Score
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border-2 border-purple-100">
                            <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-3xl w-24 h-24 mb-8 shadow-xl"></div>
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">No data available</h3>
                            <p className="text-gray-600 text-xl font-medium">We couldn't load your dashboard data at the moment</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Home;