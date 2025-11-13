import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import BudgetForecast from "../components/BudgetForecast";

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
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Financial Forecast</h1>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading forecast data...</p>
                        </div>
                    ) : dashboardData ? (
                        <BudgetForecast 
                            incomeTransactions={dashboardData?.recent5Income || []}
                            expenseTransactions={dashboardData?.recent5Expense || []}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p>No forecast data available</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Forecast;