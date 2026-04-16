import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Outlet } from "react-router-dom";
import { User, Shield, Users, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const AdminLayout = ({ activeMenu }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    // Check if user is admin, if not redirect to dashboard
    if (user?.role !== "ADMIN") {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
        return null;
    }

    const adminMenuItems = [
        {
            id: "1",
            label: "Admin Dashboard",
            icon: Shield,
            path: "/admin/dashboard"
        },
        {
            id: "2",
            label: "User Management",
            icon: Users,
            path: "/admin/users"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation Bar */}
            <div className="bg-white shadow-lg border-b border-gray-200">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-purple-600" />
                            <h1 className="ml-2 text-2xl font-bold text-gray-800">Admin Panel</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                            {user?.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-100 shadow-sm"
                                />
                            ) : (
                                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full border-2 border-purple-100 shadow-sm">
                                    <User className="w-5 h-5 text-purple-600" />
                                </div>
                            )}
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.name || "Admin User"}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }}
                            className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
                        >
                            <LogOut className="h-5 w-5 mr-1" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-white shadow-lg border-r border-gray-200">
                    <div className="p-5">
                        <div className="flex flex-col gap-2">
                            {adminMenuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-4 text-[15px] py-4 px-6 rounded-xl transition-all duration-300 transform font-medium shadow-sm hover:shadow-md ${
                                        activeMenu === item.label
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg scale-[1.02]'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="text-xl" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;