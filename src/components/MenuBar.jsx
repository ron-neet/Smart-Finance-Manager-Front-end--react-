import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { LogOut, Menu, Sidebar, User, X } from "lucide-react";
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
        <div className="flex items-center justify-between gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] px-4 py-4 sm:px-7 sticky top-0 z-30">
            {/* Left Section - Menu Button and title */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
                >
                    {openSideMenu ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <img src={assets.logo} alt="logo" className="h-15 w-15" />
                    <span className="text-lg font-medium text-black truncate">
                        Smart Finance Manager
                    </span>
                </div>
            </div>

            {/* Right Section - User Profile */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2">
                    <User className="text-purple-500" />
                </button>

                {/* DropDown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                    <User className="w-4 h-4 text-purple-600 " />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {user?.fullName || ""}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                <LogOut className="w-4 h-4 text-gray-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )
                }

            </div>

            {/* Mobile Menu */}
            {openSideMenu && (
                <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-0 top-[73px]">
                    <Sidebar activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default MenuBar;
