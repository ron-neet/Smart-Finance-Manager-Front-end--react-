import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ label, value, onChange, placeholder, type, isSelect, options }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-6">
            <label className="text-sm font-bold text-gray-800 block mb-2">
                {label}
            </label>
            <div className="relative">
                {isSelect ? (
                    <select
                        className="w-full bg-white outline-none border border-gray-300 rounded-xl py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
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
                        className="w-full bg-white outline-none border border-gray-300 rounded-xl py-4 px-5 pr-12 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                        type={type === 'Password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e)}
                    />
                )}

                {type === 'Password' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye
                                size={22}
                                className="text-purple-600 hover:text-purple-800 transition-colors"
                                onClick={togglePasswordVisibility}
                            />
                        ) : (
                            <EyeOff
                                size={22}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={togglePasswordVisibility} />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;