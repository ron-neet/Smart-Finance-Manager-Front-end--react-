import { useEffect, useState } from "react";
import CustomLineChart from "./CustomLineChart.jsx";
import { Plus } from "lucide-react";

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

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg font-semibold">
                        Income Overview
                    </h5>

                    <p className="text-sm text-gray-500 mt-1">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>
                <button className="add-btn" onClick={onAddIncome}>
                <Plus size={15} className="text-lg" />Add Income
            </button>
            </div>

            
            <div className="mt-8">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default IncomeOverView;