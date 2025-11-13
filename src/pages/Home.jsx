import { Coins, Wallet, WalletCards } from "lucide-react";
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

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <p>Loading dashboard data...</p>
                        </div>
                    ) : dashboardData ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InfoCard
                                    label="Total Balance"
                                    value={addThousandsSeparator(dashboardData.TotalBalance || 0.00)}
                                    icon={<WalletCards className="h-6 w-6" />}
                                    color="bg-purple-800"
                                />
                                <InfoCard
                                    label="Total Income"
                                    value={addThousandsSeparator(dashboardData.LatestIncome || 0.00)}
                                    icon={<Wallet className="h-6 w-6" />}
                                    color="bg-green-800"
                                />
                                <InfoCard
                                    label="Total Expense"
                                    value={addThousandsSeparator(dashboardData.latestExpense || 0.00)}
                                    icon={<Coins className="h-6 w-6" />}
                                    color="bg-red-800"
                                />
                            </div>
                            
                            {/* Transaction Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <RecentTransaction
                                    transactions={dashboardData?.recent5TransactionList || []}
                                    onMore={() => navigate("/expense")}
                                />
                                <FinanceOverView
                                    totalBalance={dashboardData?.TotalBalance || 0.00}
                                    totalIncome={dashboardData?.LatestIncome || 0.00}
                                    totalExpense={dashboardData?.latestExpense || 0.00}
                                />
                                <Transactions 
                                    title="Recent Expenses"
                                    transactions={dashboardData?.recent5Expense || []}
                                    onMore={() => navigate("/expense")}
                                    type="expense"
                                />
                                <Transactions 
                                    title="Recent Income"
                                    transactions={dashboardData?.recent5Income || []}
                                    onMore={() => navigate("/income")}
                                    type="income"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-32">
                            <p>No dashboard data available</p>
                        </div>
                    )}
                </div>
            </Dashboard>
        </div>
    )
}

export default Home;