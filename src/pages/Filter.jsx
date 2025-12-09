import { Search, Filter as FilterIcon, Calendar, SortDesc, DollarSign } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import TransactionInfoCard from "../components/TransactionInfoCard";
import moment from "moment";
import toast from "react-hot-toast";

const Filter = () => {

    useUser();

    const [loading, setLoading] = useState(false);
    const [startdate, setStartdate] = useState("");
    const [enddate, setEnddate] = useState("");
    const [sortorder, setSortorder] = useState("asc");
    const [sortField, setSortField] = useState("date");
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("income");
    const [transactions, setTransactions] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Determine which endpoint to use based on type
            let endpoint;
            if (type === "income") {
                endpoint = API_ENDPOINTS.GET_ALL_INCOMES;
            } else {
                endpoint = API_ENDPOINTS.GET_ALL_EXPENSES;
            }
            
            const response = await axiosConfig.get(endpoint);
            if (response.status === 200) {
                // Add type property to each transaction based on the filter type
                const transactionsWithType = response.data.map(transaction => ({
                    ...transaction,
                    type: type // Ensure each transaction has the correct type property
                }));
                
                // Filter by date range if provided
                let filteredData = transactionsWithType;
                
                if (startdate) {
                    filteredData = filteredData.filter(t => new Date(t.date) >= new Date(startdate));
                }
                
                if (enddate) {
                    filteredData = filteredData.filter(t => new Date(t.date) <= new Date(enddate));
                }
                
                // Filter by keyword if provided
                if (keyword) {
                    filteredData = filteredData.filter(t => 
                        t.name.toLowerCase().includes(keyword.toLowerCase()) ||
                        (t.category && t.category.name.toLowerCase().includes(keyword.toLowerCase()))
                    );
                }
                
                // Sort data
                filteredData.sort((a, b) => {
                    let aValue, bValue;
                    
                    switch (sortField) {
                        case "amount":
                            aValue = parseFloat(a.amount);
                            bValue = parseFloat(b.amount);
                            break;
                        case "name":
                            aValue = a.name.toLowerCase();
                            bValue = b.name.toLowerCase();
                            break;
                        case "date":
                        default:
                            aValue = new Date(a.date);
                            bValue = new Date(b.date);
                    }
                    
                    if (sortorder === "asc") {
                        return aValue > bValue ? 1 : -1;
                    } else {
                        return aValue < bValue ? 1 : -1;
                    }
                });
                
                setTransactions(filteredData);
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dashboard activeMenu="Filter">
                <div className="my-5 mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Transaction Filter</h1>
                            <p className="text-gray-600 mt-2">Search and filter your income and expense transactions</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <FilterIcon size={22} />
                            <span className="font-bold text-lg">{transactions.length} Results</span>
                        </div>
                    </div>
                    
                    {/* Filter Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <FilterIcon className="text-purple-600" size={28} />
                            </div>
                            <h5 className="text-2xl font-bold text-gray-800">
                                Filter Options
                            </h5>
                        </div>
                        
                        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" onSubmit={handleSearch}>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-800" htmlFor="type">
                                    Transaction Type
                                </label>
                                <select 
                                    id="type" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all hover:shadow-md"
                                    value={type} 
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-800" htmlFor="startdate">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        id="startdate" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all hover:shadow-md"
                                        value={startdate} 
                                        onChange={(e) => setStartdate(e.target.value)} 
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Calendar className="text-gray-400" size={20} />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-800" htmlFor="enddate">
                                    End Date
                                </label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        id="enddate" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all hover:shadow-md"
                                        value={enddate} 
                                        onChange={(e) => setEnddate(e.target.value)} 
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Calendar className="text-gray-400" size={20} />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-800" htmlFor="sortfield">
                                    Sort By
                                </label>
                                <select 
                                    id="sortfield" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all hover:shadow-md"
                                    value={sortField} 
                                    onChange={(e) => setSortField(e.target.value)}
                                >
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                    <option value="name">Category</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-800" htmlFor="sortorder">
                                    Sort Order
                                </label>
                                <select 
                                    id="sortorder" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all hover:shadow-md"
                                    value={sortorder} 
                                    onChange={(e) => setSortorder(e.target.value)}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block mb-2 text-sm font-bold text-gray-800">
                                    Search
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search transactions..." 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all pr-12 hover:shadow-md"
                                        value={keyword} 
                                        onChange={(e) => setKeyword(e.target.value)} 
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Search className="text-gray-400" size={20} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-end">
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Search size={20} />
                                            Apply Filters
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Results Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <DollarSign className="text-purple-600" size={28} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Filtered Transactions
                                </h1>
                            </div>
                            <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                                {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                            </div>
                        </div>
                        
                        {transactions.length === 0 && !loading ? (
                            <div className="text-center py-16">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-md">
                                    <Search className="text-gray-400" size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions found</h3>
                                <p className="text-gray-500">Adjust your filters and try again</p>
                            </div>
                        ) : loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((transaction, index) => (
                                    <TransactionInfoCard
                                        key={transaction.id}
                                        icon={transaction.icon}
                                        title={transaction.name}
                                        date={moment(transaction.date).format("DD/MM/YYYY")}
                                        amount={transaction.amount}
                                        type={transaction.type} // Use the transaction's actual type
                                        hideDeleteBtn={true} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Dashboard>
        </div>
    )
}

export default Filter;