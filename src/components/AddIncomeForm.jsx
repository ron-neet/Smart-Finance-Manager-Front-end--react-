import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle, TrendingUp } from "lucide-react";

const AddIncomeForm = ({ onAddIncome, categories, initialData, isEditing }) => {

    const [income, setIncome] = useState({
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
        setIncome({ ...income, [key]: actualValue });
    }

    const handleAddIncome = async () => {
        setLoading(true);
        try {
            await onAddIncome(income);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!isEditing && categories.length > 0 && !income.categoryId){
            setIncome((prev)=>({...prev, categoryId: categories[0].id}));
        }
        }, [categories, income.categoryId, isEditing]);

    return (
        <div className="p-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="text-green-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{isEditing ? "Update Income" : "Add New Income"}</h3>
            </div>
            
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input
                label="Income Source"
                value={income.name}
                onChange={(e) => handleChange('name', e)}
                placeholder="e.g., Salary, Freelance"
                type="text"
            />

            <Input
                label="Category"
                value={income.categoryId}
                onChange={(e) => handleChange('categoryId', e)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                label="Amount"
                value={income.amount}
                onChange={(e) => handleChange('amount', e)}
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                label="Date"
                value={income.date}
                onChange={(e) => handleChange('date', e)}
                placeholder="e.g., 2023-07-01"
                type="date"
            />

            <div className="flex justify-end mt-8" >
                <button
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                    onClick={handleAddIncome}
                    disabled={loading}>
                    
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin" size={20} />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            <TrendingUp size={20} />
                            {isEditing ? "Update Income" : "Add Income"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
};

export default AddIncomeForm;