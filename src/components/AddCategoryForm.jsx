import { useEffect, useState } from "react";
import Input from "../components/Input"; // ✅ make sure Input has default export
import EmojiPickerPopup from "./EmojiPickerPopup";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {

    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData)
        } else {
            setCategory({name:"", type:"income", icon: ""});
        }
    }, [isEditing, initialCategoryData])

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" },

    ]

    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value });
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">

            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
            />
            <Input
                label="Category Type"
                value={category.type}
                onChange={({ target }) => handleChange("type", target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition-all duration-200 
                   bg-gradient-to-r from-purple-600 to-indigo-500 
                   hover:from-purple-700 hover:to-indigo-600 
                   disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                        {isEditing ? "Updating Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>

        </div>
    )
}

export default AddCategoryForm;