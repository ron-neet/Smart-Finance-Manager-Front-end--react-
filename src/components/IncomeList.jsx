import { Download, Mail, TrendingUp } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";
import { useState } from "react";

const IncomeList = ({ transactions, onDelete, onDownload, onEmail }) => {

    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        } catch (error) {
            console.error("Error downloading file:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <TrendingUp className="text-green-600" size={28} />
                    </div>
                    <div>
                        <h5 className="text-2xl font-bold text-gray-800">Income Sources</h5>
                        <p className="text-gray-600 text-base mt-1">All your income records in one place</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                    {onEmail && (
                        <button 
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                            onClick={onEmail}
                        >
                            <Mail size={20} />
                            <span>Email</span>
                        </button>
                    )}
                    {onDownload && (
                        <button 
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                            onClick={handleDownload}
                            disabled={loading}
                        >
                            <Download size={20} />
                            <span>{loading ? 'Downloading...' : 'Download'}</span>
                        </button>
                    )}
                </div>
            </div>

            {transactions?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {transactions.map((income) => (
                        <TransactionInfoCard
                            key={income.id}
                            title={income.name}
                            icon={income.icon}
                            date={moment(income.date).format("DD/MM/YYYY")}
                            amount={income.amount}
                            type="income"
                            onDelete={() => onDelete(income.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No income records yet</h3>
                    <p className="text-gray-500 text-lg">Add your first income to get started</p>
                </div>
            )}
        </div>
    )
}

export default IncomeList;