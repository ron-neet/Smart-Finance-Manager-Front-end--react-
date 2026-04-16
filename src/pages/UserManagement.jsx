import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import { Search, Filter, User, Shield, ShieldOff, UserX, Eye, Edit } from "lucide-react";
import Modal from "../components/Modal";
import DeleteAlert from "../components/DeleteAlert";
import { getAllUsers, promoteUserToAdmin, demoteAdminToUser, suspendUser, activateUser, deleteUser } from "../util/adminService";

const UserManagement = () => {
    useUser();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch users from API
    const fetchUsers = async () => {
        if (loading) return;
        
        setLoading(true);
        
        try {
            const userData = await getAllUsers();
            setUsers(userData);
            setLoading(false);
        } catch (err) {
            toast.error(err.message || "Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Normalize user data to ensure consistent field names and values
    const normalizeUserData = (user) => {
        // Handle different possible field names for status
        let normalizedStatus = "UNKNOWN";
        if (user.status) {
            normalizedStatus = user.status.toUpperCase();
        } else if (user.accountStatus) {
            normalizedStatus = user.accountStatus.toUpperCase();
        } else if (user.isActive !== undefined) {
            normalizedStatus = user.isActive ? "ACTIVE" : "SUSPENDED";
        } else if (user.enabled !== undefined) {
            normalizedStatus = user.enabled ? "ACTIVE" : "SUSPENDED";
        }
        
        // Ensure status is one of our expected values
        if (!["ACTIVE", "SUSPENDED"].includes(normalizedStatus)) {
            normalizedStatus = "UNKNOWN";
        }
        
        // Handle different possible field names for role
        let normalizedRole = "USER";
        if (user.role) {
            normalizedRole = user.role.toUpperCase();
        } else if (user.userRole) {
            normalizedRole = user.userRole.toUpperCase();
        }
        
        // Ensure role is one of our expected values
        if (!["USER", "ADMIN"].includes(normalizedRole)) {
            normalizedRole = "USER";
        }
        
        return {
            ...user,
            status: normalizedStatus,
            role: normalizedRole,
            name: user.name || user.fullName || user.username || "",
            email: user.email || "",
            createdAt: user.createdAt || user.createdDate || user.registeredAt || "N/A",
            lastLogin: user.lastLogin || user.lastLoginDate || user.lastLoggedIn || "Never"
        };
    };

    // Filter users based on search term and filters
    const filteredUsers = users.map(normalizeUserData).filter(user => {
        // Safely handle potentially undefined properties
        const userName = user.name || user.fullName || "";
        const userEmail = user.email || "";
        const userRole = user.role || "";
        const userStatus = user.status || "";
        
        const matchesSearch = searchTerm === "" || 
                             userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || userRole === roleFilter;
        const matchesStatus = statusFilter === "all" || userStatus === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // View user details
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    // Promote user to admin
    const handlePromoteToAdmin = async (userId) => {
        try {
            await promoteUserToAdmin(userId);
            toast.success("User promoted to admin successfully");
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to promote user to admin");
        }
    };

    // Demote admin to user
    const handleDemoteToUser = async (userId) => {
        try {
            await demoteAdminToUser(userId);
            toast.success("Admin demoted to user successfully");
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to demote admin to user");
        }
    };

    // Suspend user
    const handleSuspendUser = async (userId) => {
        try {
            await suspendUser(userId);
            toast.success("User suspended successfully");
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to suspend user");
        }
    };

    // Activate user
    const handleActivateUser = async (userId) => {
        try {
            await activateUser(userId);
            toast.success("User activated successfully");
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to activate user");
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            toast.success("User deleted successfully");
            setIsDeleteModalOpen(false);
            // Refresh the user list
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to delete user");
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-600 mt-2 text-lg">Manage users, roles, and account status</p>
                    </div>
                </div>
                
                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Shield className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm appearance-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="UNKNOWN">Unknown</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-xl border border-gray-100">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Users Table */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden flex-grow flex flex-col">
                            <div className="overflow-x-auto flex-grow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                                                                <User className="h-5 w-5 text-purple-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name || user.fullName || "Unknown User"}</div>
                                                            <div className="text-sm text-gray-500">{user.email || "No email"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        (user.role || "") === "ADMIN" 
                                                            ? "bg-purple-100 text-purple-800" 
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                        {user.role || "USER"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        (user.status || "") === "ACTIVE" 
                                                            ? "bg-green-100 text-green-800" 
                                                            : (user.status || "") === "SUSPENDED" 
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                        {user.status || "UNKNOWN"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.createdAt || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.lastLogin || "Never"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleViewUser(user)}
                                                            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                                                            title="View"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                        
                                                        {(user.role || "") === "USER" ? (
                                                            <button
                                                                onClick={() => handlePromoteToAdmin(user.id)}
                                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                                                                title="Promote to Admin"
                                                            >
                                                                <Shield className="h-5 w-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleDemoteToUser(user.id)}
                                                                className="text-purple-500 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50"
                                                                title="Demote to User"
                                                            >
                                                                <ShieldOff className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                        
                                                        {(user.status || "") === "ACTIVE" ? (
                                                            <button
                                                                onClick={() => handleSuspendUser(user.id)}
                                                                className="text-amber-500 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-50"
                                                                title="Suspend"
                                                            >
                                                                <UserX className="h-5 w-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActivateUser(user.id)}
                                                                className="text-green-500 hover:text-green-700 p-2 rounded-lg hover:bg-green-50"
                                                                title="Activate"
                                                            >
                                                                <User className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                        
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <UserX className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                                currentPage === 1 
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                                currentPage === totalPages 
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                                                <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                                                <span className="font-medium">{filteredUsers.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                                        currentPage === 1 
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                
                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNumber = index + 1;
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => paginate(pageNumber)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                currentPage === pageNumber
                                                                    ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                                
                                                <button
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                                        currentPage === totalPages 
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            
            {/* User Detail Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="User Details"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                                    <User className="h-8 w-8 text-purple-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name || selectedUser.fullName || "Unknown User"}</h3>
                                <p className="text-gray-500">{selectedUser.email || "No email"}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="font-medium">{selectedUser.role || "USER"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">{selectedUser.status || "UNKNOWN"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Created At</p>
                                <p className="font-medium">{selectedUser.createdAt || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last Login</p>
                                <p className="font-medium">{selectedUser.lastLogin || "Never"}</p>
                            </div>
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                            {(selectedUser.role || "") === "USER" ? (
                                <button
                                    onClick={() => {
                                        handlePromoteToAdmin(selectedUser.id);
                                        setIsViewModalOpen(false);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md"
                                >
                                    Promote to Admin
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleDemoteToUser(selectedUser.id);
                                        setIsViewModalOpen(false);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md"
                                >
                                    Demote to User
                                </button>
                            )}
                            
                            {(selectedUser.status || "") === "ACTIVE" ? (
                                <button
                                    onClick={() => {
                                        handleSuspendUser(selectedUser.id);
                                        setIsViewModalOpen(false);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-md"
                                >
                                    Suspend User
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleActivateUser(selectedUser.id);
                                        setIsViewModalOpen(false);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md"
                                >
                                    Activate User
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Delete Confirmation Modal */}
            <DeleteAlert
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDeleteUser(selectedUser?.id)}
                title="Delete User"
                message={`Are you sure you want to delete ${selectedUser?.name || selectedUser?.fullName || "this user"}? This action cannot be undone.`}
            />
        </div>
    );
};

export default UserManagement;