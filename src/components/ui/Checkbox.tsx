import React from 'react';
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}
export const Checkbox = ({
  label,
  description,
  className = '',
  checked,
  onChange,
  ...props
}: CheckboxProps) => {
  return <label className={`flex cursor-pointer items-start ${className}`}>
      <div className="flex h-5 items-center">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-ash-teal focus:ring-ash-teal" checked={checked} onChange={onChange} {...props} />
      </div>
      {(label || description) && <div className="ml-2">
          {label && <div className="text-sm font-medium text-gray-700">{label}</div>}
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>}
    </label>;
};