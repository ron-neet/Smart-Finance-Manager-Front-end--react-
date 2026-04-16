import { Trash2, TrendingDown, TrendingUp, UtensilsCrossed, Pencil } from "lucide-react";
import { addThousandsSeparator } from "../util/utils";


const TransactionInfoCard = ({ icon, title, date, amount, type, hideDeleteBtn, onDelete, onEdit }) => {

    // Ensure type is a valid string, default to 'expense' if not provided or invalid
    const normalizedType = (typeof type === 'string') ? type.toLowerCase() : 'expense';
    
    const getAmountStyles = () => normalizedType === "income" ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200' : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200';

    return (
        <div className="group relative flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-md">
            <div className="w-14 h-14 flex items-center justify-center text-xl text-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm">
                {icon ? (
                    <img src={icon} alt={title} className="w-8 h-8" />
                ) :
                    (
                        <UtensilsCrossed className="text-purple-800" size={24} />
                    )
                }
            </div>
            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-base text-gray-800 font-bold">{title}</p>
                    <p className="text-sm text-gray-500 mt-1">{date}</p>
                </div>
                <div className="flex items-center gap-3">
                    {onEdit && (
                        <button
                            className="text-gray-400 hover:text-purple-600 group-hover:opacity-100 transition-all duration-300 cursor-pointer opacity-0 p-2 rounded-lg hover:bg-purple-50"
                            onClick={onEdit}
                        >
                            <Pencil size={18} />
                        </button>
                    )}

                    {!hideDeleteBtn && (
                        <button
                            className="text-gray-400 hover:text-red-500 group-hover:opacity-100 transition-all duration-300 cursor-pointer opacity-0 p-2 rounded-lg hover:bg-red-50"
                            onClick={onDelete}
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getAmountStyles()} font-bold shadow-sm`}>
                        <h6 className="text-base">
                            {normalizedType === 'income' ? '+' : '-'} ${addThousandsSeparator(amount)}
                        </h6>
                        {normalizedType === 'income' ? (
                            <TrendingUp size={18} />
                        ) : (
                            <TrendingDown size={18} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TransactionInfoCard;