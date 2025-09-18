import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  type?: string;
}
export const Input = ({
  label,
  error,
  fullWidth = true,
  className = '',
  type = 'text',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? showPassword ? 'text' : 'password' : type;
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  return <div className={`${widthClass} ${className}`}>
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>}
      <div className="relative">
        <input type={inputType} className={`${widthClass} rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal ${errorClass}`} {...props} />
        {isPassword && <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>;
};