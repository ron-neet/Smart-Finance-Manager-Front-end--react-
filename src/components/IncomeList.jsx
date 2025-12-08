import { Download, Mail } from "lucide-react";
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
        <div className="bg-white rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h5 className="text-xl font-bold text-gray-800">Income Sources</h5>
                    <p className="text-gray-600 text-sm mt-1">All your income records in one place</p>
                </div>
                <div className="flex items-center justify-end gap-3">
                    {onEmail && (
                        <button 
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                            onClick={onEmail}
                        >
                            <Mail size={18} />
                            <span className="font-medium">Email</span>
                        </button>
                    )}
                    {onDownload && (
                        <button 
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                            onClick={handleDownload}
                            disabled={loading}
                        >
                            <Download size={18} />
                            <span className="font-medium">{loading ? 'Downloading...' : 'Download'}</span>
                        </button>
                    )}
                </div>
            </div>

            {transactions?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No income records yet</h3>
                    <p className="text-gray-500">Add your first income to get started</p>
                </div>
            )}
        </div>
    )
}

export default IncomeList;