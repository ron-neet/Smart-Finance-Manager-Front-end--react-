import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import { Users, UserCheck, UserX, Activity } from "lucide-react";
import { getAllUsers } from "../util/adminService";

const AdminDashboard = () => {
    useUser();

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        suspendedUsers: 0,
        adminUsers: 0
    });
    
    const [loading, setLoading] = useState(false);
    const [recentActivity, setRecentActivity] = useState([]);

    const fetchDashboardStats = async () => {
        if (loading) return;
        
        setLoading(true);
        
        try {
            // Fetch actual user data
            const userData = await getAllUsers();
            
            // Calculate statistics
            const totalUsers = userData.length;
            const activeUsers = userData.filter(user => user.status === "ACTIVE").length;
            const suspendedUsers = userData.filter(user => user.status === "SUSPENDED").length;
            const adminUsers = userData.filter(user => user.role === "ADMIN").length;
            
            setStats({
                totalUsers,
                activeUsers,
                suspendedUsers,
                adminUsers
            });
            
            // Simulate recent activity for now
            setRecentActivity([
                { id: 1, action: "User registered", user: "john.doe@example.com", timestamp: "2023-05-15 14:30" },
                { id: 2, action: "User promoted to admin", user: "jane.admin@example.com", timestamp: "2023-05-15 13:45" },
                { id: 3, action: "User suspended", user: "spam.user@example.com", timestamp: "2023-05-15 12:15" },
                { id: 4, action: "New category created", user: "admin@example.com", timestamp: "2023-05-15 11:20" },
                { id: 5, action: "Budget threshold updated", user: "admin@example.com", timestamp: "2023-05-15 10:05" }
            ]);
            
            setLoading(false);
        } catch (err) {
            toast.error(err.message || "Failed to fetch dashboard statistics");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    return (
        <div className="my-5 mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2 text-lg">Overview of system statistics and recent activity</p>
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white border border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-bold">Total Users</p>
                                    <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white border border-green-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-bold">Active Users</p>
                                    <h3 className="text-3xl font-bold mt-2">{stats.activeUsers}</h3>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <UserCheck className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white border border-amber-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm font-bold">Suspended Users</p>
                                    <h3 className="text-3xl font-bold mt-2">{stats.suspendedUsers}</h3>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <UserX className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white border border-purple-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-bold">Admin Users</p>
                                    <h3 className="text-3xl font-bold mt-2">{stats.adminUsers}</h3>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <Activity className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button 
                                onClick={() => window.location.href = '/admin/users'}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md flex items-center justify-center gap-3"
                            >
                                <Users className="h-5 w-5" />
                                <span>User Management</span>
                            </button>
                            
                            <button 
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md flex items-center justify-center gap-3"
                            >
                                <Activity className="h-5 w-5" />
                                <span>System Logs</span>
                            </button>
                            
                            <button 
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md flex items-center justify-center gap-3"
                            >
                                <Activity className="h-5 w-5" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentActivity.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;