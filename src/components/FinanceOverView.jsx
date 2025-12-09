import { addThousandsSeparator } from "../util/utils";
import CustomPieChart from "./CustomPieChart";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const FinanceOverView = ({ totalBalance, totalIncome, totalExpense }) => {

    const COLORS = ["#59168B", "#016630", "#a0090e"];

    const balanceData = [
        {
            name: "Total Balance", amount: totalBalance || 0
        },
        {
            name: "Total Income", amount: totalIncome || 0
        },
        {
            name: "Total Expense", amount: totalExpense || 0
        }
    ];

    // Calculate net cash flow
    const netCashFlow = totalIncome - totalExpense;

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Wallet className="text-purple-600" size={24} />
                    </div>
                    <h5 className="text-xl font-bold text-gray-800">Finance Overview</h5>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-md">
                    <span className="font-bold text-lg">${addThousandsSeparator(totalBalance || 0)}</span>
                    <span className="text-sm">Balance</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-green-600" size={20} />
                        <span className="text-sm font-medium text-green-700">Income</span>
                    </div>
                    <p className="text-xl font-bold text-green-800">${addThousandsSeparator(totalIncome || 0)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-xl border border-rose-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="text-rose-600" size={20} />
                        <span className="text-sm font-medium text-rose-700">Expenses</span>
                    </div>
                    <p className="text-xl font-bold text-rose-800">${addThousandsSeparator(totalExpense || 0)}</p>
                </div>
                
                <div className={`bg-gradient-to-br ${netCashFlow >= 0 ? 'from-green-50 to-emerald-50 border-green-100' : 'from-rose-50 to-red-50 border-rose-100'} p-4 rounded-xl border shadow-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet className={`${netCashFlow >= 0 ? 'text-green-600' : 'text-rose-600'}`} size={20} />
                        <span className={`text-sm font-medium ${netCashFlow >= 0 ? 'text-green-700' : 'text-rose-700'}`}>Net Flow</span>
                    </div>
                    <p className={`text-xl font-bold ${netCashFlow >= 0 ? 'text-green-800' : 'text-rose-800'}`}>
                        ${addThousandsSeparator(Math.abs(netCashFlow) || 0)}
                        <span className="text-sm ml-1">{netCashFlow >= 0 ? '(+)' : '(-)'}</span>
                    </p>
                </div>
            </div>
            
            <CustomPieChart 
                data={balanceData}
                colors={COLORS}
                totalAmount={`$${addThousandsSeparator(totalBalance || 0)}`}
            />
        </div>
    )
}

export default FinanceOverView;