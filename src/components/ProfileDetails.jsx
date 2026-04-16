import { User, Mail, Shield, Calendar, Clock, Edit2, Camera, Save, X, LoaderCircle } from "lucide-react";
import { useState, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoint";
import toast from "react-hot-toast";
import uploadProfileImage from "../util/uploadProfileImage";

const ProfileDetails = ({ user }) => {
    const { setUser } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || user?.name || "",
        email: user?.email || "",
        profileImageUrl: user?.profileImageUrl || ""
    });

    if (!user) return null;

    // Normalize data based on what's available in the user object
    const displayName = user.fullName || user.name || "Guest User";
    const displayEmail = user.email || "No email provided";
    const displayRole = user.role || "USER";
    const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : "N/A";
    const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Recently";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadProfileImage(file);
            setFormData(prev => ({ ...prev, profileImageUrl: imageUrl }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, formData);
            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setUser(response.data); // Update global context
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Header Section with Avatar */}
            <div className="relative group flex flex-col items-center">
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />
                <div className="relative">
                    <div className={`w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-600 shadow-2xl transition-all duration-500 transform ${isEditing ? 'hover:scale-105 cursor-pointer' : 'group-hover:scale-105'}`}
                         onClick={() => isEditing && fileInputRef.current.click()}>
                        <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center relative">
                            {isUploading ? (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                    <LoaderCircle className="animate-spin text-white" size={32} />
                                </div>
                            ) : null}
                            
                            {formData.profileImageUrl || user.profileImageUrl ? (
                                <img 
                                    src={formData.profileImageUrl || user.profileImageUrl} 
                                    alt={displayName} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-purple-600/50" />
                            )}
                            
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Camera className="text-white" size={24} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    {isEditing ? (
                        <div className="flex flex-col items-center">
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="text-2xl font-bold bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none text-center text-gray-800 pb-1 px-4 mb-2"
                                placeholder="Enter full name"
                            />
                        </div>
                    ) : (
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                            {displayName}
                        </h2>
                    )}
                    <span className={`mt-2 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${displayRole === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}>
                        {displayRole}
                    </span>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email Card */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-purple-50 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            <Mail size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                            {isEditing ? (
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-purple-200 focus:border-purple-600 outline-none font-semibold text-gray-800 py-1"
                                    placeholder="Enter email"
                                />
                            ) : (
                                <p className="text-gray-800 font-semibold truncate">{displayEmail}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role Card */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <Shield size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                            <p className="text-gray-800 font-semibold">{displayRole}</p>
                        </div>
                    </div>
                </div>

                {/* Join Date Card */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-purple-50 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            <Calendar size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                            <p className="text-gray-800 font-semibold">{joinDate}</p>
                        </div>
                    </div>
                </div>

                {/* Last Login Card */}
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <Clock size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Activity</p>
                            <p className="text-gray-800 font-semibold">{lastLogin}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-4 flex gap-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-200 transition-all duration-300"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="animate-spin" size={18} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileDetails;
