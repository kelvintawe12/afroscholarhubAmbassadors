import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
}
export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ash-teal focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-ash-gold text-ash-dark hover:bg-yellow-400 active:bg-yellow-500',
    secondary: 'bg-ash-teal text-white hover:bg-[#156880] active:bg-[#105060]',
    outline: 'border border-ash-teal text-ash-teal bg-transparent hover:bg-ash-teal/10'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';
  return <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-ash-light border-t-transparent"></div> : null}
      {children}
    </button>;
};