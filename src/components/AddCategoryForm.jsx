import { useEffect, useState } from "react";
import Input from "./Input";
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
            console.error("Error submitting category:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {isEditing ? "Update Category" : "Add New Category"}
                </h3>
                <p className="text-gray-600 text-sm">
                    {isEditing ? "Modify your category details" : "Create a new category for your transactions"}
                </p>
            </div>

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

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 
                   bg-gradient-to-r from-purple-600 to-indigo-600 
                   hover:from-purple-700 hover:to-indigo-700 
                   disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryForm;