import { Plus, Layers } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategoriesDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategoryData(response.data);
            }
        } catch (error) {
            toast.error("Failed to fetch categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const { name, type, icon } = category;

        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        // Check for Duplicate items
        const isDuplicate = categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
        })

        if (isDuplicate) {
            toast.error("Category Name already exists");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORIES, { name, type, icon });

            if (response.status === 200 || response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoriesDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category.");
        }
    };

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }

    const handleUpdateCategory = async(updatedCategory) => {
        const {id, name, type, icon} = updatedCategory;
        if(!name.trim()){
            toast.error("Category Name is required!")
            return;
        }

        if(!id){
            toast.error("Category Id is missing for update!")
            return;
        }

        try{
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
            toast.success("Category updated Successfully");
            fetchCategoriesDetails();
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to Update Category")
        }
    }

    // Calculate stats
    const incomeCategories = categoryData.filter(cat => cat.type === 'income').length;
    const expenseCategories = categoryData.filter(cat => cat.type === 'expense').length;

    return (
        <div>
            <Dashboard activeMenu="Category">
                <div className="my-5 mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">Category Management</h1>
                            <p className="text-gray-600 mt-2 text-xl font-medium">Organize your income and expense categories</p>
                        </div>
                        <button
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] font-bold text-lg"
                        >
                            <Plus size={24} />
                            <span>Add Category</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white border-2 border-purple-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-base font-bold">Total Categories</p>
                                    <h3 className="text-4xl font-bold mt-3">{categoryData.length}</h3>
                                </div>
                                <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                    <Layers className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white border-2 border-green-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-base font-bold">Income Categories</p>
                                    <h3 className="text-4xl font-bold mt-3">{incomeCategories}</h3>
                                </div>
                                <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-red-700 rounded-3xl shadow-2xl p-8 text-white border-2 border-rose-300 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-rose-100 text-base font-bold">Expense Categories</p>
                                    <h3 className="text-4xl font-bold mt-3">{expenseCategories}</h3>
                                </div>
                                <div className="p-4 bg-white bg-opacity-25 rounded-2xl backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100 hover:shadow-3xl transition-all duration-300">
                        <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />
                    </div>

                    {/* Add Category Modal */}
                    <Modal
                        isOpen={openAddCategoryModal}
                        onClose={() => setOpenAddCategoryModal(false)}
                        title="Add New Category"
                    >
                        <AddCategoryForm onAddCategory={handleAddCategory} />
                    </Modal>

                    {/* Edit Category Modal */}
                    <Modal
                        onClose={() => {
                            setOpenEditCategoryModal(false);
                            setSelectedCategory(null);
                        }}
                        isOpen={openEditCategoryModal}
                        title="Update Category"
                    >
                        <AddCategoryForm
                            initialCategoryData={selectedCategory}
                            onAddCategory={handleUpdateCategory}
                            isEditing={true}
                        />
                    </Modal>
                </div>
            </Dashboard>
        </div>
    );
};

export default Category;