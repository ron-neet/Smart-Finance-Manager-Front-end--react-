    import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ label, value, onChange, placeholder, type, isSelect, options }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-8">
            <label className="text-base font-bold text-gray-800 block mb-3">
                {label}
            </label>
            <div className="relative">
                {isSelect ? (
                    <select
                        className="w-full bg-white/80 backdrop-blur-sm outline-none border-2 border-purple-100 rounded-2xl py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                        value={value}
                        onChange={(e) => onChange(e)}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="w-full bg-white/80 backdrop-blur-sm outline-none border-2 border-purple-100 rounded-2xl py-4 px-6 pr-12 text-gray-700 leading-tight focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl font-medium placeholder-gray-400"
                        type={type === 'Password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e)}
                    />
                )}

                {type === 'Password' && (
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer z-10">
                        {showPassword ? (
                            <Eye
                                size={24}
                                className="text-purple-600 hover:text-purple-800 transition-colors hover:scale-110 transform"
                                onClick={togglePasswordVisibility}
                            />
                        ) : (
                            <EyeOff
                                size={24}
                                className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 transform" 
                                onClick={togglePasswordVisibility} />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;