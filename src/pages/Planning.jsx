import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import SavingsGoalPlanner from "../components/SavingsGoalPlanner";
import { Target } from "lucide-react";

const Planning = () => {
    useUser();

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

    // Extract income and expense history from dashboard data
    const extractIncomeHistory = () => {
        if (!dashboardData?.recent5Income) return [];
        
        // For demo purposes, create a more varied income history
        // In a real app, this would come from actual transaction data
        const baseIncome = dashboardData.LatestIncome || 5000;
        return [
            baseIncome * 0.8, // Lower month
            baseIncome * 1.2, // Higher month
            baseIncome,       // Average month
            baseIncome * 0.9, // Slightly lower
            baseIncome * 1.1, // Slightly higher
            baseIncome * 0.7  // Low month
        ];
    };

    const extractExpenseHistory = () => {
        if (!dashboardData?.recent5Expense) return [];
        
        // For demo purposes, create expense history
        // In a real app, this would come from actual transaction data
        const baseExpense = dashboardData.latestExpense || 3000;
        return [
            baseExpense * 1.1, // Higher expense month
            baseExpense * 0.9, // Lower expense month
            baseExpense,       // Average month
            baseExpense * 1.05,// Slightly higher
            baseExpense * 0.95,// Slightly lower
            baseExpense * 1.2  // High expense month
        ];
    };

    const incomeHistory = extractIncomeHistory();
    const expenseHistory = extractExpenseHistory();

    return (
        <div>
            <Dashboard activeMenu="Planning">
                <div className="my-5 mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Financial Planning</h1>
                            <p className="text-gray-600 mt-2 text-lg">Plan your savings goals and analyze your financial stability</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <Target className="h-6 w-6 text-indigo-800" />
                                </div>
                                <div>
                                    <p className="text-sm">Current Balance</p>
                                    <p className="text-2xl font-bold">${(dashboardData?.TotalBalance || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-80 bg-white rounded-2xl shadow-xl border border-gray-100">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : dashboardData ? (
                        <div className="w-full">
                            <SavingsGoalPlanner 
                                totalBalance={dashboardData?.TotalBalance || 0}
                                incomeHistory={incomeHistory}
                                expenseHistory={expenseHistory}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                            <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-2xl w-20 h-20 mb-6 shadow-md"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No data available</h3>
                            <p className="text-gray-500 text-lg">We couldn't load your planning data at the moment</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Planning;