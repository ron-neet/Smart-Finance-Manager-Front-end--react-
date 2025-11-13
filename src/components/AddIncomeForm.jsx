import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({ onAddIncome, categories }) => {

    const [income, setIncome] = useState({
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
        console.log("Income state updated:", income);
        if(categories.length > 0 && !income.categoryId){
            setIncome((prev)=>({...prev, categoryId: categories[0].id}));
        }
        }, [categories, income.categoryId]);

    return (
        <div>
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

            <div className="flex justify-end mt-6" >
                <button
                    className="bg-[#059669] text-white px-4 py-2 rounded-md"
                    onClick={handleAddIncome}
                    disabled={loading}>

                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            Add Income
                        </>
                    )}
                </button>
            </div>
        </div>
    )
};

export default AddIncomeForm;