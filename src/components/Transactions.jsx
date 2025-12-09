import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const Transactions = ({ transactions, onMore, type, title }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {type === 'income' ? (
                            <TrendingUp className="text-green-600" size={24} />
                        ) : (
                            <TrendingDown className="text-red-600" size={24} />
                        )}
                    </div>
                    <h5 className="text-xl font-bold text-gray-800">{title}</h5>
                </div>
                <button 
                    className="flex items-center text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 font-medium shadow-md"
                    onClick={onMore}
                >
                    More 
                    <ArrowRight className="text-base ml-1" size={16} />
                </button>
            </div>
            <div className="space-y-4">
                {transactions?.slice(0, 5).length > 0 ? (
                    transactions.slice(0, 5).map(item => (
                        <TransactionInfoCard 
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("DD/MM/YYYY")}
                            amount={item.amount}
                            type={type}
                            hideDeleteBtn={true}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
                        <p className="text-gray-500">Your {title.toLowerCase()} will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Transactions;