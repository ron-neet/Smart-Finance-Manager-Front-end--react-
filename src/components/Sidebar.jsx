import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User, Home, CreditCard, Wallet, Coins, TrendingUp, BarChart3, PiggyBank, Calendar, Funnel, LogOut } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-64 h-[calc(100vh-73px)] bg-gradient-to-b from-white via-purple-50/30 to-indigo-50/30 border-r border-purple-100/50 p-6 lg:sticky top-[73px] z-20 rounded-b-3xl lg:rounded-r-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex-1">
                <div className="flex flex-col items-center justify-center gap-4 mt-4 mb-8">
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-2xl hover:shadow-purple-300 transition-all duration-300"
                        />
                    ) : (
                        <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full border-4 border-purple-200 shadow-2xl hover:shadow-purple-300 transition-all duration-300 transform hover:scale-105">
                            <User className="w-12 h-12 text-white" />
                        </div>
                    )}
                    <div className="text-center">
                        <h5 className="text-gray-900 font-bold text-xl leading-6 drop-shadow-sm">
                            {user?.fullName || "Guest User"}
                        </h5>
                        <p className="text-gray-600 text-sm mt-1 font-medium">{user?.email || "user@example.com"}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3"> 
                    {SIDE_BAR_DATA.map((item, index) => (
                        <button
                            onClick={() => navigate(item.path)}
                            key={`menu_${index}`}
                            className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-4 px-6 rounded-2xl transition-all duration-300 transform font-semibold shadow-md hover:shadow-xl ${
                                activeMenu === item.label
                                    ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white shadow-2xl scale-[1.03] ring-2 ring-purple-300'
                                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700'
                            }`}
                        >
                            <item.icon className="text-xl" />
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Logout button at the bottom */}
            <div className="mt-8 pb-4">
                <button
                    onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-4 text-[14px] py-4 px-6 rounded-2xl transition-all duration-300 bg-gradient-to-r from-rose-50 to-red-50 text-red-600 hover:from-rose-100 hover:to-red-100 font-bold shadow-lg hover:shadow-xl border border-rose-100"
                >
                    <LogOut className="text-xl" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;