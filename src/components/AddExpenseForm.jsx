import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories }) => {

    const [expense, setExpense] = useState({
        name: "",
        amount: "",
        icon: "",
        date: "",
        categoryId: ""
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
        console.log("Expense state updated:", expense);
        if(categories.length > 0 && !expense.categoryId){
            setExpense((prev)=>({...prev, categoryId: categories[0].id}));
        }
        }, [categories, expense.categoryId]);

    return (
        <div>
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

            <div className="flex justify-end mt-6" >
                <button
                    className="bg-[#dc2626] text-white px-4 py-2 rounded-md"
                    onClick={handleAddExpense}
                    disabled={loading}>

                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            Add Expense
                        </>
                    )}
                </button>
            </div>
        </div>
    )
};

export default AddExpenseForm;