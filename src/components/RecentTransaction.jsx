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
        <div className="bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-bold text-gray-800">Recent Transactions</h5>
                <button 
                    className="flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    onClick={onMore}
                >
                    More 
                    <ArrowRight className="text-base ml-1" size={16} />
                </button>
            </div>

            <div className="space-y-3">
                {processedTransactions.slice(0, 5).length > 0 ? (
                    processedTransactions.slice(0, 5).map(item => (
                        <TransactionInfoCard 
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("DD/MM/YYYY")}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn={true}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No transactions yet</p>
                        <p className="text-sm text-gray-400 mt-1">Your recent transactions will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default RecentTransaction;