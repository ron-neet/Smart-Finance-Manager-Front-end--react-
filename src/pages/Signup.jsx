import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import { validateEmail } from "../util/validation.js";
import toast from "react-hot-toast";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
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
            console.log("Submitting to:", API_ENDPOINTS.REGISTER);
            console.log({ fullName, email, password });


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
            console.error("Signup error:", err);
            setError("An error occurred during signup. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full relative flex items-center justify-center bg-gray-100 overflow-hidden">
            <img
                src={assets.login_bg}
                alt="login_bg"
                className="absolute inset-0 w-full h-full object-cover filter blur-sm"
            />
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-3xl font-semibold mb-2 text-center text-gray-900">
                        Create An Account
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Start tracking your spending by joining us.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="flex items-center justify-center mb-6">
                                <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                placeholder="John Doe"
                                type="text"
                            />
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                placeholder="fullname@example.com"
                                type="text"
                            />
                            <div className="col-span-2 relative">
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Password"
                                    placeholder="*********"
                                    type={showPassword ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`w-full py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:opacity-90 hover:shadow-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin h-5 w-5" />
                                    Signing Up...
                                </>
                            ) : (
                                <>Sign Up</>
                            )}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-purple-500 hover:underline transition-colors"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
