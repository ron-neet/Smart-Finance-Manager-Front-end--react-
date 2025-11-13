import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import { Plus } from "lucide-react";
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
                console.log("Income fetched successfully:", response.data)
                setIncomeData(response.data);
            }

        } catch (err) {
            console.error("Failed to fetch the Income");
            toast.error("Failed to fetch Income")
        } finally {
            setLoading(false);
        }
    }

    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                console.log("Income Categories fetched successfully:", response.data);
                setCategories(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch Income Categories");
            toast.error("Failed to fetch Income Categories");
        }
    };

    const handleAddIncome = async (income) => {
        console.log("Adding Income:", income);
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
                console.log("Income added successfully:", response.data);
                toast.success("Income added successfully");
                setOpenAddIncomeModal(false);
                await fetchIncomeDetails();
            }

        } catch (err) {
            console.error("Failed to add Income:", err);
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
                console.log("Income deleted successfully:", response.data);
                toast.success("Income deleted successfully");
                await fetchIncomeDetails();
            }
        } catch (err) {
            console.error("Failed to delete Income:", err);
            toast.error("Failed to delete Income");
        } finally {
            setLoading(false);
        }

    }

    const handleDownloadIncomeDetails = async () => {
        console.log("Download Income Details");
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
            console.error("Failed to download Income details:", err);
            // Check if it's a permission error
            if (err.response && err.response.status === 403) {
                toast.error("You don't have permission to download income details");
            } else {
                toast.error("Failed to download Income details");
            }
        }
    }

    const handleEmailIncomeDetails = () => {
        console.log("Email Income Details");
    }


    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    return (
        <div>
            <Dashboard activeMenu="Income">
                <div className="my-5 mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <IncomeOverView transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)} />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <IncomeList
                                transactions={incomeData}
                                onDownload={handleDownloadIncomeDetails}
                                onEmail={handleEmailIncomeDetails}
                                onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                            />
                        </div>

                        <Modal
                            isOpen={openAddIncomeModal}
                            onClose={() => setOpenAddIncomeModal(false)}
                            title="Add Income"
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
                                content="Are you sure you want to delete this income details?"
                                onDelete={async () => {
                                    await deleteIncome(openDeleteAlert.data);
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

export default Income;