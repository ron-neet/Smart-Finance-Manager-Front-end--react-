import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { LogOut, Menu, Sidebar, User, X, WalletCards } from "lucide-react";
import { assets } from "../assets/assets";

const MenuBar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data from context and localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        clearUser();
        setShowDropdown(false);
        navigate("/login");
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showDropdown]);

    return (
        <div className="flex items-center justify-between gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] px-4 py-4 sm:px-7 sticky top-0 z-30 shadow-sm">
            {/* Left Section - Menu Button and title */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className="block lg:hidden text-black hover:bg-gray-100 p-2 rounded-lg transition-colors shadow-sm"
                >
                    {openSideMenu ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
                        <WalletCards className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800 truncate">
                        Smart Finance Manager
                    </span>
                </div>
            </div>

            {/* Right Section - User Profile */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
                >
                    <User className="text-purple-600" size={24} />
                </button>

                {/* DropDown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 fade-in">
                        {/* User Info */}
                        <div className="px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-gray-800 truncate">
                                        {user?.fullName || "Guest User"}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate mt-1">
                                        {user?.email || "user@example.com"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-5 py-3 text-base text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg mx-2"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )
                }

            </div>

            {/* Mobile Menu */}
            {openSideMenu && (
                <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px] shadow-lg">
                    <Sidebar activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default MenuBar;