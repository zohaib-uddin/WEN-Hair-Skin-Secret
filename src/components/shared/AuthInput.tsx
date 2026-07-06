import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type = "text",
  className = "",
  id,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full flex flex-col mb-4">
      <label
        htmlFor={id}
        className="text-[12px] uppercase tracking-[1px] font-bold text-[#1a1a1a] mb-[8px] text-left"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          required={required}
          className={`w-full border-2 border-[#e5e5e5] rounded-xl px-[16px] py-[14px] text-[14px] text-[#1a1a1a] bg-white focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 focus:outline-none transition-all duration-200 placeholder:text-[#6b6b6b] placeholder:text-[13px] ${className} ${
            isPassword ? "pr-[40px]" : ""
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" />
            ) : (
              <Eye className="w-[18px] h-[18px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
