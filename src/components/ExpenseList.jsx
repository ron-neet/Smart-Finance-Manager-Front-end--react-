import { Download, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const ExpenseList = ({ transactions, onDelete, onDownload, onEmail }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expense Source</h5>
                <div className="flex items-center justify-end gap-6">
                    {onEmail && (
                        <button className="card-btn" onClick={onEmail}>
                            <Mail size={15} className="text-base" /> Email
                        </button>
                    )}
                    {onDownload && (
                        <button className="card-btn" onClick={onDownload}>
                            <Download size={15} className="text-base" /> Download
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={expense.id}
                        title={expense.name}
                        icon={expense.icon}
                        date={moment(expense.date).format("DD/MM/YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpenseList;