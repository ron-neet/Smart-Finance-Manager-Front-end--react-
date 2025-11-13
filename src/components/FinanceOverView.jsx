import { addThousandsSeparator } from "../util/utils";
import CustomPieChart from "./CustomPieChart";

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

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold">Finance Overview</h5>
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