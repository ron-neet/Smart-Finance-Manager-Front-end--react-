import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ label, value, onChange, placeholder, type, isSelect, options }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 block mb-2">
                {label}
            </label>
            <div className="relative">
                {isSelect ? (
                    <select
                        className="w-full bg-white outline-none border border-gray-300 rounded-xl py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
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
                        className="w-full bg-white outline-none border border-gray-300 rounded-xl py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
                        type={type === 'Password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e)}
                    />
                )}

                {type === 'Password' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye
                                size={20}
                                className="text-purple-600"
                                onClick={togglePasswordVisibility}
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                className="text-gray-400"
                                onClick={togglePasswordVisibility} />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;