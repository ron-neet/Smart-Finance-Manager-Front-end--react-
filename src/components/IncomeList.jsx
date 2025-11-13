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
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income Source</h5>
                <div className="flex items-center justify-end gap-6">
                    {onEmail && (
                        <button className="card-btn" onClick={onEmail}>
                            <Mail size={15} className="text-base" /> Email
                        </button>
                    )}
                    {onDownload && (
                        <button className="card-btn" onClick={handleDownload}>
                            <Download size={15} className="text-base" /> Download
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {transactions?.map((income) => (
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
        </div>
    )
}

export default IncomeList;