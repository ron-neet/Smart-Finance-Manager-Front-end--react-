import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const Transactions = ({ transactions, onMore, type, title }) => {
    return (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold">{title}</h5>
                <button className="btn btn-ghost" onClick={onMore}>
                    More <ArrowRight className="text-base" size={15} />
                </button>
            </div>
            <div className="mt-6">
                {transactions?.slice(0, 6).map(item => (
                    <TransactionInfoCard 
                    key={item.id}
                    title={item.name}
                    icon={item.icon}
                    date={moment(item.date).format("DD/MM/YYYY")}
                    amount={item.amount}
                    type={type}
                    hideDeleteBtn={true}
                    />
                ))}
            </div>
        </div>
    )
};

export default Transactions;