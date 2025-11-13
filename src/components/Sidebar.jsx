import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
                        <User className="w-10 h-10 text-gray-500" />
                    </div>
                )}

                <h5 className="text-gray-900 font-semibold leading-6 text-center">
                    {user?.fullName || "Guest User"}
                </h5>
            </div>

            <div className="flex flex-col gap-4"> 
                {SIDE_BAR_DATA.map((item, index) => (
                    <button
                        onClick={() => navigate(item.path)}
                        key={`menu_${index}`}
                        className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg transition-all duration-300 transform ${activeMenu === item.label
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-105'
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
