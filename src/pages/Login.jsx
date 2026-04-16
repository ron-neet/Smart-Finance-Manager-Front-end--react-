import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoint.js";
import { validateEmail } from "../util/validation.js";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { LoaderCircle, Lock, Mail, WalletCards, Facebook, Twitter, Instagram } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
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
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });

            const { token, user } = response.data;

            if (token && user) {
                // Save token for API use
                localStorage.setItem("token", token);

                // Save user in localStorage (for persistence after refresh)
                localStorage.setItem("user", JSON.stringify(user));

                // Update context
                setUser(user);

                toast.success(`Welcome back, ${user.fullName}!`);

                navigate("/dashboard");
            } else {
                setError("Invalid server response: Missing token or user data");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Financial-themed gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
            
            {/* Animated financial pattern overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-20 text-purple-400 animate-pulse">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 3.05 0 2.22 1.83 2.97 4.82 3.69 2.14.51 2.61 1.15 2.61 1.93 0 .59-.49 1.41-1.96 1.41-1.63 0-2.27-.76-2.37-1.84H9.56c.11 1.68 1.03 2.77 2.64 3.18V19h2.2v-1.69c1.53-.29 2.72-1.16 2.73-3.04 0-2.38-1.95-3.21-4.82-3.91z"/>
                    </svg>
                </div>
                <div className="absolute bottom-20 right-20 text-indigo-400 animate-pulse animation-delay-2000">
                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
                    </svg>
                </div>
                <div className="absolute top-1/2 left-1/4 text-emerald-400 animate-pulse animation-delay-4000">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.7 13.3l-8.8-8.8c-0.4-0.4-1-0.4-1.4 0l-3.3 3.3c-0.4 0.4-0.4 1 0 1.4l8.8 8.8c0.4 0.4 1 0.4 1.4 0l3.3-3.3c0.4-0.4 0.4-1 0-1.4zM3.3 17.3l-2-2c-0.4-0.4-0.4-1 0-1.4l3.3-3.3c0.4-0.4 1-0.4 1.4 0l2 2c0.4 0.4 0.4 1 0 1.4l-3.3 3.3c-0.4 0.4-1 0.4-1.4 0z"/>
                    </svg>
                </div>
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"></div>

            {/* Login Form */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                            <WalletCards className="text-white" size={52} />
                        </div>
                        <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Welcome Back!
                        </h3>
                        <p className="text-gray-600 text-lg font-medium">
                            Please enter your credentials to login.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
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
                                    type="password"
                                    className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                                />
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
                            className={`w-full py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 transform hover:-translate-y-1"}`}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-6 h-6" />
                                    Logging In...
                                </>
                            ) : (
                                "LOGIN"
                            )}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-600 text-sm mb-4">Or continue with</p>
                            <div className="flex items-center justify-center gap-4">
                                <button className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                    <Facebook size={20} />
                                </button>
                                <button className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                    <Instagram size={20} />
                                </button>
                                <button className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </button>
                                <button className="p-3 bg-gradient-to-br from-black to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-gray-600 text-lg">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="font-bold text-purple-600 hover:text-purple-800 transition-colors underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;