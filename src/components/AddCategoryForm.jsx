import { useEffect, useState } from "react";
import Input from "./Input";
import EmojiPickerPopup from "./EmojiPickerPopup";
import { LoaderCircle, Tag } from "lucide-react";

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
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Tag className="text-white" size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {isEditing ? "Update Category" : "Add New Category"}
                    </h3>
                    <p className="text-gray-600 text-base mt-2 font-medium">
                        {isEditing ? "Modify your category details" : "Create a new category for your transactions"}
                    </p>
                </div>
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

            <div className="flex justify-end mt-10 pt-8 border-t-2 border-purple-100">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 
                   bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 
                   hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 
                   disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02]
                   focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-6 h-6 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            <Tag size={22} />
                            {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryForm;