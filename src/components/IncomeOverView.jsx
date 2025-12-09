import { useEffect, useState } from "react";
import CustomLineChart from "./CustomLineChart.jsx";
import { Plus, TrendingUp } from "lucide-react";

const IncomeOverView = ({ transactions, onAddIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Prepare chart data from transactions - Show ALL data points without any date filtering
        const preparedData = transactions.map((transaction, index) => ({
            date: transaction.date,
            amount: parseFloat(transaction.amount),
            name: transaction.name,
            id: index
        }));

        setChartData(preparedData);
    }, [transactions]);

    // Calculate total income
    const totalIncome = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <TrendingUp className="text-green-600" size={28} />
                        </div>
                        <h5 className="text-2xl font-bold text-gray-800">
                            Income Overview
                        </h5>
                    </div>

                    <p className="text-gray-600 text-lg mb-5">
                        Track your earnings over time and analyze your income trends.
                    </p>
                    
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl inline-flex items-center shadow-lg">
                        <span className="font-bold text-xl">${totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <span className="text-base ml-3">Total Income</span>
                    </div>
                </div>
                
                <button 
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg transform hover:-translate-y-1"
                    onClick={onAddIncome}
                >
                    <Plus size={22} />
                    <span>Add Income</span>
                </button>
            </div>
            
            <div className="mt-8 h-80">
                <CustomLineChart data={chartData} type="income" />
            </div>
        </div>
    )
}

export default IncomeOverView;