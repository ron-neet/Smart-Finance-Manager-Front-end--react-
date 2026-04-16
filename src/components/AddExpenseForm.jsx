import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle, TrendingDown } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories, initialData, isEditing }) => {

    const [expense, setExpense] = useState({
        name: initialData?.name || "",
        amount: initialData?.amount || "",
        icon: initialData?.icon || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        categoryId: initialData?.categoryId || ""
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        // Handle both direct values and event objects
        const actualValue = value && value.target ? value.target.value : value;
        setExpense({ ...expense, [key]: actualValue });
    }

    const handleAddExpense = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!isEditing && categories.length > 0 && !expense.categoryId){
            setExpense((prev)=>({...prev, categoryId: categories[0].id}));
        }
        }, [categories, expense.categoryId, isEditing]);

    return (
        <div className="p-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                    <TrendingDown className="text-red-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{isEditing ? "Update Expense" : "Add New Expense"}</h3>
            </div>
            
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input
                label="Expense Source"
                value={expense.name}
                onChange={(e) => handleChange('name', e)}
                placeholder="e.g., Groceries, Rent"
                type="text"
            />

            <Input
                label="Category"
                value={expense.categoryId}
                onChange={(e) => handleChange('categoryId', e)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                label="Amount"
                value={expense.amount}
                onChange={(e) => handleChange('amount', e)}
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                label="Date"
                value={expense.date}
                onChange={(e) => handleChange('date', e)}
                placeholder="e.g., 2023-07-01"
                type="date"
            />

            <div className="flex justify-end mt-8" >
                <button
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                    onClick={handleAddExpense}
                    disabled={loading}>
                    
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin" size={20} />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            <TrendingDown size={20} />
                            {isEditing ? "Update Expense" : "Add Expense"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
};

export default AddExpenseForm;