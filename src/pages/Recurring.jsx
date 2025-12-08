import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import { RECURRENCE_FREQUENCIES, calculateNextOccurrence } from "../util/recurringTransactions";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";

const Recurring = () => {
    useUser();

    const [recurringTransactions, setRecurringTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        name: "",
        amount: "",
        type: "expense",
        categoryId: "",
        frequency: "monthly",
        startDate: new Date().toISOString().split('T')[0],
        endDate: ""
    });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchRecurringTransactions = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_RECURRING_TRANSACTIONS);
            if (response.status === 200) {
                setRecurringTransactions(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Endpoint doesn't exist yet, show empty state
                setRecurringTransactions([]);
            } else {
                toast.error("Failed to fetch recurring transactions");
            }
        }
    };

    const fetchCategories = async () => {
        try {
            // For recurring transactions, we'll fetch all categories since they can be income or expense
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    const handleAddTransaction = async () => {
        // Validate required fields
        if (!newTransaction.name) {
            toast.error("Please enter a name");
            return;
        }
        
        if (!newTransaction.amount) {
            toast.error("Please enter an amount");
            return;
        }
        
        if (!newTransaction.categoryId || newTransaction.categoryId === "") {
            toast.error("Please select a category");
            return;
        }

        // Validate amount
        const amount = parseFloat(newTransaction.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Find the selected category (handle potential type mismatches)
        const category = categories.find(c => c.id == newTransaction.categoryId);
        
        // Check if category exists
        if (!category) {
            toast.error("Please select a valid category");
            return;
        }
        
        try {
            const transactionData = {
                name: newTransaction.name,
                amount: amount,
                type: newTransaction.type,
                categoryId: newTransaction.categoryId,
                categoryName: category.name,
                frequency: newTransaction.frequency,
                startDate: newTransaction.startDate,
                endDate: newTransaction.endDate || null,
                nextOccurrence: newTransaction.startDate,
                icon: category.icon
            };

            const response = await axiosConfig.post(API_ENDPOINTS.ADD_RECURRING_TRANSACTION, transactionData);
            if (response.status === 200 || response.status === 201) {
                toast.success("Recurring transaction added successfully");
                setNewTransaction({
                    name: "",
                    amount: "",
                    type: "expense",
                    categoryId: "",
                    frequency: "monthly",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: ""
                });
                setShowModal(false);
                fetchRecurringTransactions();
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Recurring transaction endpoint not implemented yet");
            } else if (error.response && error.response.status === 400) {
                toast.error("Invalid transaction data");
            } else {
                toast.error("Failed to add recurring transaction");
            }
        }
    };

    const handleUpdateTransaction = async () => {
        // Validate required fields
        if (!editingTransaction.name) {
            toast.error("Please enter a name");
            return;
        }
        
        if (!editingTransaction.amount) {
            toast.error("Please enter an amount");
            return;
        }
        
        if (!editingTransaction.categoryId || editingTransaction.categoryId === "") {
            toast.error("Please select a category");
            return;
        }

        // Validate amount
        const amount = parseFloat(editingTransaction.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Find the selected category (handle potential type mismatches)
        const category = categories.find(c => c.id == editingTransaction.categoryId);
        
        // Check if category exists
        if (!category) {
            toast.error("Please select a valid category");
            return;
        }
        
        try {
            const transactionData = {
                ...editingTransaction,
                categoryName: category.name,
                icon: category.icon
            };

            const response = await axiosConfig.put(
                API_ENDPOINTS.UPDATE_RECURRING_TRANSACTION(editingTransaction.id),
                transactionData
            );
            if (response.status === 200) {
                toast.success("Recurring transaction updated successfully");
                setEditingTransaction(null);
                setShowModal(false);
                fetchRecurringTransactions();
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Update endpoint not implemented yet");
            } else {
                toast.error("Failed to update recurring transaction");
            }
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_RECURRING_TRANSACTION(transactionId));
            if (response.status === 200 || response.status === 204) {
                toast.success("Recurring transaction deleted successfully");
                fetchRecurringTransactions();
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Delete endpoint not implemented yet");
            } else {
                toast.error("Failed to delete recurring transaction");
            }
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingTransaction(null);
        setNewTransaction({
            name: "",
            amount: "",
            type: "expense",
            categoryId: "",
            frequency: "monthly",
            startDate: new Date().toISOString().split('T')[0],
            endDate: ""
        });
        setShowModal(true);
    };

    useEffect(() => {
        fetchRecurringTransactions();
        fetchCategories();
    }, []);

    // Format frequency for display
    const formatFrequency = (frequency) => {
        const frequencyMap = {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'biweekly': 'Bi-weekly',
            'monthly': 'Monthly',
            'bimonthly': 'Bi-monthly',
            'quarterly': 'Quarterly',
            'yearly': 'Yearly'
        };
        return frequencyMap[frequency] || frequency;
    };

    return (
        <div>
            <Dashboard activeMenu="Recurring">
                <div className="my-5 mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Recurring Transactions</h1>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                            <Plus size={16} />
                            Add Recurring Transaction
                        </button>
                    </div>

                    {/* Recurring Transactions List */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        {recurringTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {recurringTransactions.map(transaction => {
                                    const nextDate = new Date(transaction.nextOccurrence);
                                    const endDate = transaction.endDate ? new Date(transaction.endDate) : null;
                                    
                                    return (
                                        <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-lg ${
                                                        transaction.type === 'income' 
                                                            ? 'bg-green-100 text-green-600' 
                                                            : 'bg-red-100 text-red-600'
                                                    }`}>
                                                        {transaction.icon ? (
                                                            <span dangerouslySetInnerHTML={{__html: transaction.icon}} />
                                                        ) : (
                                                            <Calendar size={24} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{transaction.name}</h3>
                                                        <p className="text-sm text-gray-600">{transaction.categoryName}</p>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <span className={`font-medium ${
                                                                transaction.type === 'income' 
                                                                    ? 'text-green-600' 
                                                                    : 'text-red-600'
                                                            }`}>
                                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatFrequency(transaction.frequency)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Next occurrence</p>
                                                        <p className="font-medium">{nextDate.toLocaleDateString()}</p>
                                                        {endDate && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Ends: {endDate.toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(transaction)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No recurring transactions yet</h3>
                                <p className="text-gray-600 mb-6">Create your first recurring transaction to automatically track regular income or expenses.</p>
                                <button
                                    onClick={openAddModal}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Add Recurring Transaction
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal for Add/Edit Transaction */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    {editingTransaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={editingTransaction ? editingTransaction.name : newTransaction.name}
                                            onChange={(e) => editingTransaction 
                                                ? setEditingTransaction({...editingTransaction, name: e.target.value})
                                                : setNewTransaction({...newTransaction, name: e.target.value})
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="e.g., Rent, Salary, Subscription"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                            <input
                                                type="number"
                                                value={editingTransaction ? editingTransaction.amount : newTransaction.amount}
                                                onChange={(e) => editingTransaction 
                                                    ? setEditingTransaction({...editingTransaction, amount: e.target.value})
                                                    : setNewTransaction({...newTransaction, amount: e.target.value})
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                value={editingTransaction ? editingTransaction.type : newTransaction.type}
                                                onChange={(e) => editingTransaction 
                                                    ? setEditingTransaction({...editingTransaction, type: e.target.value})
                                                    : setNewTransaction({...newTransaction, type: e.target.value})
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="income">Income</option>
                                                <option value="expense">Expense</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={editingTransaction ? editingTransaction.categoryId : newTransaction.categoryId}
                                            onChange={(e) => editingTransaction 
                                                ? setEditingTransaction({...editingTransaction, categoryId: e.target.value})
                                                : setNewTransaction({...newTransaction, categoryId: e.target.value})
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                                        <select
                                            value={editingTransaction ? editingTransaction.frequency : newTransaction.frequency}
                                            onChange={(e) => editingTransaction 
                                                ? setEditingTransaction({...editingTransaction, frequency: e.target.value})
                                                : setNewTransaction({...newTransaction, frequency: e.target.value})
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="biweekly">Bi-weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="bimonthly">Bi-monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={editingTransaction ? editingTransaction.startDate : newTransaction.startDate}
                                                onChange={(e) => editingTransaction 
                                                    ? setEditingTransaction({...editingTransaction, startDate: e.target.value})
                                                    : setNewTransaction({...newTransaction, startDate: e.target.value})
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                                            <input
                                                type="date"
                                                value={editingTransaction ? (editingTransaction.endDate || '') : newTransaction.endDate}
                                                onChange={(e) => editingTransaction 
                                                    ? setEditingTransaction({...editingTransaction, endDate: e.target.value})
                                                    : setNewTransaction({...newTransaction, endDate: e.target.value})
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingTransaction(null);
                                        }}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    >
                                        {editingTransaction ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Dashboard>
        </div>
    );
};

export default Recurring;