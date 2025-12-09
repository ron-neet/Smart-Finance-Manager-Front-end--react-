import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import { validateEmail } from "../util/validation.js";
import toast from "react-hot-toast";
import { LoaderCircle, Eye, EyeOff, User, Mail, Lock, WalletCards } from "lucide-react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoint.js";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let profileImageUrl = "";

        setIsLoading(true);

        if (!fullName) {
            setError("Full name is required");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!password) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        setError("");

        try {
            if(profilePhoto) {
                // Upload profile photo and get URL
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }

            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl,
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("Registration Successful! Please login.");
                navigate("/login");
            }
        } catch (err) {
            setError("An error occurred during signup. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
            {/* Background decoration elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                            <WalletCards className="text-white" size={48} />
                        </div>
                        <h3 className="text-4xl font-bold mb-3 text-gray-800">
                            Create An Account
                        </h3>
                        <p className="text-gray-600 text-lg">
                            Start tracking your spending by joining us.
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex items-center justify-center mb-8">
                            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        type="text"
                                        className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        type="email"
                                        className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-12 pr-14 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showPassword ? 
                                            <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-600" /> : 
                                            <Eye className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-base font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-1'}`}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin h-6 w-6" />
                                    Signing Up...
                                </>
                            ) : (
                                <>Sign Up</>
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-600 text-lg">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-bold text-purple-600 hover:text-purple-800 transition-colors underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;