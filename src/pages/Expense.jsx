import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import ExpenseList from "../components/ExpenseList";
import { Plus } from "lucide-react";
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

    return (
        <div>
            <Dashboard activeMenu="Expense">
                <div className="my-5 mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <ExpenseOverView transactions={expenseData} onAddExpense={() => setOpenAddExpenseModal(true)} />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ExpenseList
                                transactions={expenseData}
                                onDownload={handleDownloadExpenseDetails}
                                onEmail={handleEmailExpenseDetails}
                                onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                            />
                        </div>

                        <Modal
                            isOpen={openAddExpenseModal}
                            onClose={() => setOpenAddExpenseModal(false)}
                            title="Add Expense"
                        >
                            <AddExpenseForm
                                onAddExpense={(expense) => handleAddExpense(expense)}
                                categories={categories}
                            />
                        </Modal>

                        {/* Delete Alert Modal */}
                        <Modal
                            isOpen={openDeleteAlert.show}
                            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                            title="Delete Expense"
                        >
                            <DeleteAlert
                                content="Are you sure you want to delete this expense details?"
                                onDelete={async () => {
                                    await deleteExpense(openDeleteAlert.data);
                                    setOpenDeleteAlert({ show: false, data: null });
                                }}
                            />

                        </Modal>
                    </div>
                </div>
            </Dashboard>
        </div>
    )
}

export default Expense;