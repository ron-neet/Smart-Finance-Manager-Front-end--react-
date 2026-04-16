import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import BudgetForecast from "../components/BudgetForecast";
import { TrendingUp, Brain } from "lucide-react";

const Forecast = () => {
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

    return (
        <div>
            <Dashboard activeMenu="Forecast">
                <div className="my-5 mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Financial Forecast</h1>
                            <p className="text-gray-600 mt-2 text-lg">Predictive analytics based on your financial patterns</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <Brain className="h-6 w-6 text-indigo-800" />
                            </div>
                            <span className="font-bold text-lg">AI-Powered</span>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-96 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : dashboardData ? (
                        <BudgetForecast 
                            incomeTransactions={dashboardData?.recent5Income || []}
                            expenseTransactions={dashboardData?.recent5Expense || []}
                            spendingHistory={dashboardData?.spendingHistory || []}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-xl p-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-2xl w-20 h-20 mb-6 shadow-md"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No forecast data available</h3>
                            <p className="text-gray-500 text-lg">We couldn't generate your financial forecast at the moment</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Forecast;