import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import ExpenseList from "../components/ExpenseList";
import { Plus, TrendingDown, Download, Mail } from "lucide-react";
import Modal from "../components/Modal";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import ExpenseOverView from "../components/ExpenseOverView";

const Expense = () => {
    useUser();

    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if (response.status === 200) {
                setExpenseData(response.data);
            }

        } catch (err) {
            toast.error("Failed to fetch Expense")
        } finally {
            setLoading(false);
        }
    }

    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (err) {
            toast.error("Failed to fetch Expense Categories");
        }
    };

    const handleAddExpense = async (expense) => {
        setLoading(true);

        const { name, amount, icon, date, categoryId } = expense;

        if (!name || !name.trim()) {
            toast.error("Expense Name is required");
            setLoading(false);
            return;
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Amount is required");
            setLoading(false);
            return;
        }
        if (!icon) {
            toast.error("Icon is required");
            setLoading(false);
            return;
        }
        if (!date || date === "Invalid Date" || isNaN(new Date(date).getTime())) {
            toast.error("Date is required");
            setLoading(false);
            return;
        }
        if (!categoryId || categoryId === "") {
            toast.error("Category is required");
            setLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        if (date > today) {
            toast.error("Future dates are not allowed");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                amount,
                icon,
                date,
                categoryId
            });
            if (response.status === 200 || response.status === 201) {
                toast.success("Expense added successfully");
                setOpenAddExpenseModal(false);
                await fetchExpenseDetails();
            }

        } catch (err) {
            toast.error("Failed to add Expense");
        } finally {
            setLoading(false);
        }
    }


    // Delete Expense
    const deleteExpense = async (id) => {
        setLoading(true);
        try {
            const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            if (response.status === 200 || response.status === 204) {
                toast.success("Expense deleted successfully");
                await fetchExpenseDetails();
            }
        } catch (err) {
            toast.error("Failed to delete Expense");
        } finally {
            setLoading(false);
        }

    }

    const handleUpdateExpense = async (updatedExpense) => {
        setLoading(true);
        const { name, amount, icon, date, categoryId } = updatedExpense;

        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_EXPENSE(selectedExpense.id), {
                name,
                amount,
                icon,
                date,
                categoryId
            });
            if (response.status === 200 || response.status === 204) {
                toast.success("Expense updated successfully");
                setOpenEditExpenseModal(false);
                setSelectedExpense(null);
                await fetchExpenseDetails();
            }
        } catch (err) {
            toast.error("Failed to update Expense");
        } finally {
            setLoading(false);
        }
    }

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, { responseType: 'blob' });
            let filename = "expense_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Expense details downloaded successfully");
        } catch (err) {
            if (err.response && err.response.status === 403) {
                toast.error("You don't have permission to download expense details");
            } else {
                toast.error("Failed to download Expense details");
            }
        }
    }

    const handleEmailExpenseDetails = () => {
        toast.error("Email functionality not implemented for expenses yet");
    }


    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    // Calculate total expense
    const totalExpense = expenseData.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

    return (
        <div>
            <Dashboard activeMenu="Expense">
                <div className="my-5 mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Expense Management</h1>
                            <p className="text-gray-600 mt-2 text-lg">Track and manage all your expenses</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDownloadExpenseDetails}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Download size={20} />
                                <span className="font-bold">Download</span>
                            </button>
                            <button 
                                onClick={handleEmailExpenseDetails}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Mail size={20} />
                                <span className="font-bold">Email</span>
                            </button>
                            <button 
                                onClick={() => setOpenAddExpenseModal(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 text-white px-5 py-3 rounded-xl hover:from-rose-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Plus size={20} />
                                <span className="font-bold">Add Expense</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl shadow-xl p-6 text-white border border-rose-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-rose-100 text-sm font-bold">Total Expenses</p>
                                    <h3 className="text-3xl font-bold mt-2">${totalExpense.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <TrendingDown className="h-8 w-8 text-indigo-800" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center text-sm text-rose-200">
                                    <span>+8.3% from last month</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                            <ExpenseOverView transactions={expenseData} onAddExpense={() => setOpenAddExpenseModal(true)} />
                        </div>
                    </div>

                    {/* Expense List */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <ExpenseList
                            transactions={expenseData}
                            onDownload={handleDownloadExpenseDetails}
                            onEmail={handleEmailExpenseDetails}
                            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                            onEdit={(expense) => {
                                setSelectedExpense(expense);
                                setOpenEditExpenseModal(true);
                            }}
                        />
                    </div>

                    {/* Add Expense Modal */}
                    <Modal
                        isOpen={openAddExpenseModal}
                        onClose={() => setOpenAddExpenseModal(false)}
                        title="Add New Expense"
                    >
                        <AddExpenseForm
                            onAddExpense={(expense) => handleAddExpense(expense)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Edit Expense Modal */}
                    <Modal
                        isOpen={openEditExpenseModal}
                        onClose={() => {
                            setOpenEditExpenseModal(false);
                            setSelectedExpense(null);
                        }}
                        title="Edit Expense"
                    >
                        <AddExpenseForm
                            onAddExpense={(expense) => handleUpdateExpense(expense)}
                            categories={categories}
                            initialData={selectedExpense}
                            isEditing={true}
                        />
                    </Modal>

                    {/* Delete Alert Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Delete Expense"
                    >
                        <DeleteAlert
                            content="Are you sure you want to delete this expense record? This action cannot be undone."
                            onDelete={async () => {
                                await deleteExpense(openDeleteAlert.data);
                                setOpenDeleteAlert({ show: false, data: null });
                            }}
                        />
                    </Modal>
                </div>
            </Dashboard>
        </div>
    )
}

export default Expense;