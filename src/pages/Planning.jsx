import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import SavingsGoalPlanner from "../components/SavingsGoalPlanner";

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
                            <h1 className="text-3xl font-bold text-gray-800">Financial Planning</h1>
                            <p className="text-gray-600 mt-2">Plan your savings goals and analyze your financial stability</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg">
                            <p className="text-sm">Current Balance</p>
                            <p className="text-xl font-bold">${(dashboardData?.TotalBalance || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
                        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg p-8">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No data available</h3>
                            <p className="text-gray-500">We couldn't load your planning data at the moment</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Planning;