import { Plus } from "lucide-react";
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
                console.log("Categories fetched successfully:", response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
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

            if (response.status === 200) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoriesDetails();
            }
        } catch (error) {
            console.error("Error adding category", error);
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
            toast.success("Category updated Sucessfully");
            fetchCategoriesDetails();
        }
        catch(error){
            console.error("Error updating category:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to Update Category")
        }
    }

    return (
        <div>
            <Dashboard activeMenu="Category">
                <div className="my-5 mx-auto">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold text-black">Categories</h2>
                        <button
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="add-btn flex items-center gap-1"
                        >
                            <Plus size={15} />
                            Add Category
                        </button>
                    </div>

                    <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />

                    {/* ✅ Modal fix: pass children correctly */}
                    <Modal
                        isOpen={openAddCategoryModal}
                        onClose={() => setOpenAddCategoryModal(false)}
                        title="Add Category"
                    >
                        <AddCategoryForm onAddCategory={handleAddCategory} />
                    </Modal>

                    {/* Updating the Category */}
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
