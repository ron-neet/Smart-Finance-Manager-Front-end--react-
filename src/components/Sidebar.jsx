import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User, Home, CreditCard, Wallet, Coins, TrendingUp, BarChart3, PiggyBank, Calendar, Funnel, LogOut } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="w-64 h-[calc(100vh-73px)] bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 p-5 sticky top-[73px] z-20 rounded-r-2xl shadow-xl">
            <div className="flex flex-col items-center justify-center gap-4 mt-4 mb-8">
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow-lg"
                    />
                ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full border-4 border-purple-100 shadow-lg">
                        <User className="w-12 h-12 text-purple-600" />
                    </div>
                )}

                <div className="text-center">
                    <h5 className="text-gray-900 font-bold text-xl leading-6">
                        {user?.fullName || "Guest User"}
                    </h5>
                    <p className="text-gray-500 text-sm mt-1">{user?.email || "user@example.com"}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2"> 
                {SIDE_BAR_DATA.map((item, index) => (
                    <button
                        onClick={() => navigate(item.path)}
                        key={`menu_${index}`}
                        className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-4 px-6 rounded-xl transition-all duration-300 transform font-medium shadow-sm hover:shadow-md ${
                            activeMenu === item.label
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg scale-[1.02]'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon className="text-xl" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Logout button at the bottom */}
            <div className="mt-auto pt-4">
                <button
                    onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-4 text-[15px] py-4 px-6 rounded-xl transition-all duration-300 bg-red-50 text-red-700 hover:bg-red-100 font-medium shadow-sm"
                >
                    <LogOut className="text-xl" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;