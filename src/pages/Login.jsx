import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoint.js";
import { validateEmail } from "../util/validation.js";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

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

            console.log("Login Response:", response.data); // 👈 for debugging

            const { token, user } = response.data;

            if (token && user) {
                // ✅ Save token for API use
                localStorage.setItem("token", token);

                // ✅ Save user in localStorage (for persistence after refresh)
                localStorage.setItem("user", JSON.stringify(user));

                // ✅ Update context
                setUser(user);

                toast.success(`Welcome back, ${user.fullName}!`);

                navigate("/dashboard");
            } else {
                setError("Invalid server response: Missing token or user data");
            }
        } catch (err) {
            console.error("Login error:", err);
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
        <div className="h-screen w-full relative flex items-center justify-center bg-gray-100 overflow-hidden">
            {/* Background Image */}
            <img
                src={assets.login_bg}
                alt="login_bg"
                className="absolute inset-0 w-full h-full object-cover filter blur-sm"
            />

            {/* Login Form */}
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-3xl font-semibold mb-2 text-center text-black">
                        Welcome Back!
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Please enter your credentials to login.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            placeholder="fullname@example.com"
                            type="text"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="*********"
                            type="password"
                        />

                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`w-full py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:opacity-90 hover:shadow-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Logging In...
                                </>
                            ) : (
                                "LOGIN"
                            )}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-purple-500 hover:underline transition-colors"
                            >
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
