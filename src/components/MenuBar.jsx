import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { LogOut, Menu, User, X, WalletCards, Moon, Sun, Bell, UserCircle } from "lucide-react";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";
import Modal from "./Modal";
import ProfileDetails from "./ProfileDetails";

const MenuBar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const { user, clearUser, darkMode, toggleDarkMode } = useContext(AppContext);
    const navigate = useNavigate();

    // Sample notifications - you can replace with real data from API
    const notifications = [
        { id: 1, title: 'Budget Alert', message: 'You\'ve used 80% of your monthly budget', time: '2 hours ago', type: 'warning' },
        { id: 2, title: 'Bill Reminder', message: 'Electricity bill due in 3 days', time: '5 hours ago', type: 'info' },
        { id: 3, title: 'Savings Goal', message: 'Congratulations! You reached 50% of your savings goal', time: '1 day ago', type: 'success' }
    ];

    const unreadCount = notifications.length; // In real app, filter unread

    const handleLogout = () => {
        // Clear user data from context and localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        clearUser();
        setShowDropdown(false);
        
        // Force reload to login page
        window.location.href = "/login";
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        const handleNotificationClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        if (showNotifications) {
            document.addEventListener("mousedown", handleNotificationClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleNotificationClickOutside);
        }
    }, [showDropdown, showNotifications]);

    return (
        <>
            <div className="flex items-center justify-between gap-5 bg-white/90 backdrop-blur-xl border-b border-purple-100/50 px-6 py-5 sm:px-8 sticky top-0 z-30 shadow-lg">
                {/* Left Section - Menu Button and title */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                        className="block lg:hidden text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        {openSideMenu ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    <div 
                        onClick={() => navigate(user ? "/dashboard" : "/")}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="p-3 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                            <WalletCards className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent truncate hidden sm:block group-hover:opacity-80 transition-opacity">
                            Smart Finance Manager
                        </span>
                    </div>
                </div>

                {/* Right Section - Notifications, Dark Mode Toggle & User Profile */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-100 hover:from-purple-100 hover:to-indigo-100 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md hover:shadow-lg transform hover:scale-105 relative"
                            title="Notifications"
                        >
                            <Bell className="text-purple-600" size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-2xl py-3 z-50 animate-fadeIn ring-1 ring-purple-100">
                                <div className="px-6 py-4 border-b border-purple-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                                            {unreadCount} new
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="px-6 py-4 hover:bg-purple-50 transition-all duration-200 cursor-pointer border-b border-purple-50 last:border-0">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                                    notification.type === 'warning' ? 'bg-amber-500' :
                                                    notification.type === 'success' ? 'bg-green-500' :
                                                    'bg-blue-500'
                                                }`}></div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-800 mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="px-6 py-3 border-t border-purple-100 text-center">
                                    <button className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-100 hover:from-purple-100 hover:to-indigo-100 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? (
                            <Sun className="text-yellow-400" size={24} />
                        ) : (
                            <Moon className="text-purple-600" size={24} />
                        )}
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                        <User className="text-white" size={26} />
                    </button>

                    {/* DropDown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-2xl py-3 z-50 animate-fadeIn ring-1 ring-purple-100">
                            {/* User Info */}
                            <div className="px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg">
                                        <User className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-gray-800 truncate">
                                            {user?.fullName || "Guest User"}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate mt-1 font-medium">
                                            {user?.email || "user@example.com"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        setShowProfileModal(true);
                                        setShowDropdown(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-6 py-3.5 text-base text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 rounded-xl mx-2 font-medium"
                                >
                                    <UserCircle className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold">My Profile</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-6 py-3.5 text-base text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 transition-all duration-300 rounded-xl mx-2 font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-semibold">Logout</span>
                                </button>
                            </div>
                        </div>
                    )
                    }

                    </div>
                </div>

                {/* Mobile Menu */}
                {openSideMenu && (
                    <div className="fixed left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-purple-100 lg:hidden z-20 top-[73px] shadow-2xl">
                        <Sidebar activeMenu={activeMenu} />
                    </div>
                )}
            </div>

            {/* Profile Detail Modal */}
            <Modal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="Account Profile"
            >
                <ProfileDetails user={user} />
            </Modal>
        </>
    );
};

export default MenuBar;