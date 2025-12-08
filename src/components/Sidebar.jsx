import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 p-5 sticky top-[61px] z-20 rounded-r-2xl shadow-lg">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 shadow-md"
                    />
                ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full border-4 border-purple-100 shadow-md">
                        <User className="w-10 h-10 text-purple-600" />
                    </div>
                )}

                <h5 className="text-gray-900 font-bold text-lg leading-6 text-center">
                    {user?.fullName || "Guest User"}
                </h5>
                <p className="text-gray-500 text-sm">{user?.email || "user@example.com"}</p>
            </div>

            <div className="flex flex-col gap-3"> 
                {SIDE_BAR_DATA.map((item, index) => (
                    <button
                        onClick={() => navigate(item.path)}
                        key={`menu_${index}`}
                        className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-4 px-6 rounded-xl transition-all duration-300 transform font-medium ${
                            activeMenu === item.label
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}>
                        <item.icon className="text-xl" />
                        {item.label}
                    </button>
                ))}

            </div>
        </div>
    );
};

export default Sidebar;