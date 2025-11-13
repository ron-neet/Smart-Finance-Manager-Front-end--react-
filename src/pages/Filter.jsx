import { Search } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import TransactionInfoCard from "../components/TransactionInfoCard";
import moment from "moment";

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
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-semibold">
                            Filter Transaction
                        </h1>
                    </div>
                    <div className="card p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-semibold">
                                Select the Filter
                            </h5>
                        </div>
                        <form className="flex flex-wrap items-end gap-4" onSubmit={handleSearch}>
                            <div>
                                <label className="block mb-2 text-sm font-medium" htmlFor="type">
                                    Type
                                </label>
                                <select id="type" className="w-full px-4 py-2 rounded border border-gray-300" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium" htmlFor="startdate">
                                    Start Date
                                </label>
                                <input type="date" id="startdate" className="w-full px-4 py-2 rounded border border-gray-300" value={startdate} onChange={(e) => setStartdate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium" htmlFor="enddate">
                                    End Date
                                </label>
                                <input type="date" id="enddate" className="w-full px-4 py-2 rounded border border-gray-300" value={enddate} onChange={(e) => setEnddate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium" htmlFor="sortfield">
                                    Sort Field
                                </label>
                                <select id="sortfield" className="w-full px-4 py-2 rounded border border-gray-300" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                    <option value="name">Category</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium" htmlFor="sortorder">
                                    Sort Order
                                </label>
                                <select id="sortorder" className="w-full px-4 py-2 rounded border border-gray-300" value={sortorder} onChange={(e) => setSortorder(e.target.value)}>
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block mb-2 text-sm font-medium">
                                    Search
                                </label>
                                <div className="flex">
                                    <input type="text" id="keyword" placeholder="Search....." className="w-full px-4 py-2 rounded-l border border-gray-300 border-r-0" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                                    <button type="submit" className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r flex items-center justify-center cursor-pointer">
                                        <Search size={20} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold">
                                Transactions
                            </h1>
                        </div>
                        {transactions.length === 0 && !loading ? (
                            <p className="text-gray-500">Select the filters and click apply to see the transactions.</p>
                        ) : ""}
                        {loading ? <p className="text-gray-500">Loading Transactions...</p>
                            : ("")}
                        {transactions.map((transaction, index) => (
                            <TransactionInfoCard
                                key={transaction.id}
                                icon={transaction.icon}
                                title={transaction.name}
                                date={moment(transaction.date).format("DD/MM/YYYY")}
                                amount={transaction.amount}
                                type={transaction.type} // Use the transaction's actual type
                                hideDeleteBtn={true} />

                        ))}
                    </div>
                </div>
            </Dashboard>
        </div>
    )
}

export default Filter;