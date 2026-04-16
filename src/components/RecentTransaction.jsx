import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h5 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Recent Transactions</h5>
                </div>
                <button 
                    className="flex items-center text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    onClick={onMore}
                >
                    More 
                    <ArrowRight className="text-base ml-2" size={18} />
                </button>
            </div>

            <div className="space-y-4">
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
                    <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions yet</h3>
                        <p className="text-gray-500 text-lg">Your recent transactions will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default RecentTransaction;