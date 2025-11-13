import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const RecentTransaction = ({ onMore, transactions }) => {
    // Ensure each transaction has a proper type property
    const processedTransactions = transactions?.map(transaction => {
        // Determine type based on various possible indicators
        let type = 'expense'; // default to expense
        
        // Check if transaction has explicit type property
        if (transaction.type) {
            type = transaction.type;
        } 
        // Check if transaction has category with type info
        else if (transaction.category && transaction.category.type) {
            type = transaction.category.type;
        }
        // Infer from amount if available (positive = income, negative = expense)
        else if (transaction.amount !== undefined) {
            type = transaction.amount >= 0 ? 'income' : 'expense';
        }
        
        return {
            ...transaction,
            type: type,
            amount: Math.abs(transaction.amount || 0) // Ensure positive amount for display
        };
    }) || [];

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold">Recent Transactions</h5>
                <button className="btn btn-ghost" onClick={onMore}>
                    More <ArrowRight className="text-base" size={15} />
                </button>
            </div>

            <div className="mt-6">
                {processedTransactions.slice(0, 6).map(item => (
                    <TransactionInfoCard 
                    key={item.id}
                    title={item.name}
                    icon={item.icon}
                    date={moment(item.date).format("DD/MM/YYYY")}
                    amount={item.amount}
                    type={item.type}
                    hideDeleteBtn={true}
                    />
                ))}
            </div>
        </div>

    )
};

export default RecentTransaction;