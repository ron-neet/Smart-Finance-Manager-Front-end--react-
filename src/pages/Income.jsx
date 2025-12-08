import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import { Plus, TrendingUp } from "lucide-react";
import Modal from "../components/Modal";
import AddIncomeForm from "../components/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverView from "../components/IncomeOverView";

const Income = () => {
    useUser();

    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                setIncomeData(response.data);
            }

        } catch (err) {
            toast.error("Failed to fetch Income")
        } finally {
            setLoading(false);
        }
    }

    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (err) {
            toast.error("Failed to fetch Income Categories");
        }
    };

    const handleAddIncome = async (income) => {
        setLoading(true);

        const { name, amount, icon, date, categoryId } = income;

        if (!name || !name.trim()) {
            toast.error("Income Name is required");
            return;
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Amount is required");
            return;
        }
        if (!icon) {
            toast.error("Icon is required");
            return;
        }
        if (!date || date === "Invalid Date" || isNaN(new Date(date).getTime())) {
            toast.error("Date is required");
            return;
        }
        if (!categoryId || categoryId === "") {
            toast.error("Category is required");
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        if (date > today) {
            toast.error("Future dates are not allowed");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount,
                icon,
                date,
                categoryId
            });
            if (response.status === 200 || response.status === 201) {
                toast.success("Income added successfully");
                setOpenAddIncomeModal(false);
                await fetchIncomeDetails();
            }

        } catch (err) {
            toast.error("Failed to add Income");
        } finally {
            setLoading(false);
        }
    }


    // Delete Income
    const deleteIncome = async (id) => {
        setLoading(true);
        try {
            const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            if (response.status === 200 || response.status === 204) {
                toast.success("Income deleted successfully");
                await fetchIncomeDetails();
            }
        } catch (err) {
            toast.error("Failed to delete Income");
        } finally {
            setLoading(false);
        }

    }

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, { responseType: 'blob' });
            let filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Income details downloaded successfully");
        } catch (err) {
            // Check if it's a permission error
            if (err.response && err.response.status === 403) {
                toast.error("You don't have permission to download income details");
            } else {
                toast.error("Failed to download Income details");
            }
        }
    }

    const handleEmailIncomeDetails = () => {
        toast.error("Email functionality not implemented for incomes yet");
    }


    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    // Calculate total income
    const totalIncome = incomeData.reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);

    return (
        <div>
            <Dashboard activeMenu="Income">
                <div className="my-5 mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Income Management</h1>
                            <p className="text-gray-600 mt-2">Track and manage all your income sources</p>
                        </div>
                        <button 
                            onClick={() => setOpenAddIncomeModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            <span className="font-medium">Add Income</span>
                        </button>
                    </div>

                    {/* Stats Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white border border-green-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Total Income</p>
                                    <h3 className="text-3xl font-bold mt-1">${totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center text-sm text-green-200">
                                    <span>+12.5% from last month</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <IncomeOverView transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)} />
                        </div>
                    </div>

                    {/* Income List */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <IncomeList
                            transactions={incomeData}
                            onDownload={handleDownloadIncomeDetails}
                            onEmail={handleEmailIncomeDetails}
                            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        />
                    </div>

                    {/* Add Income Modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title="Add New Income"
                    >
                        <AddIncomeForm
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Delete Alert Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Delete Income"
                    >
                        <DeleteAlert
                            content="Are you sure you want to delete this income record? This action cannot be undone."
                            onDelete={async () => {
                                await deleteIncome(openDeleteAlert.data);
                                setOpenDeleteAlert({ show: false, data: null });
                            }}
                        />
                    </Modal>
                </div>
            </Dashboard>
        </div>
    )
}

export default Income;