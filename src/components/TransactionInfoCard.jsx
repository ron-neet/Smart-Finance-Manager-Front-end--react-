import { Trash2, TrendingDown, TrendingUp, UtensilsCrossed } from "lucide-react";
import { addThousandsSeparator } from "../util/utils";


const TransactionInfoCard = ({ icon, title, date, amount, type, hideDeleteBtn, onDelete }) => {

    // Ensure type is a valid string, default to 'expense' if not provided or invalid
    const normalizedType = (typeof type === 'string') ? type.toLowerCase() : 'expense';
    
    const getAmountStyles = () => normalizedType === "income" ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';

    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                {icon ? (
                    <img src={icon} alt={title} className="w-12 h-12" />
                ) :
                    (
                        <UtensilsCrossed className="text-purple-800" size={24} />
                    )
                }
            </div>
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-base text-gray-700 font-medium">{title}</p>
                    <p className="text-sm text-gray-500 mt-1">{date}</p>
                </div>
                <div className="flex items-center gap-2">
                    {!hideDeleteBtn && (
                        <button
                            className="text-gray-500 hover:text-red-700 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={onDelete}
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
                        <h6 className="text-sm font-medium">
                            {normalizedType === 'income' ? '+' : '-'} ${addThousandsSeparator(amount)}
                        </h6>
                        {normalizedType === 'income' ? (
                            <TrendingUp size={15} />
                        ) : (
                            <TrendingDown size={15} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TransactionInfoCard;