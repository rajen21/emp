import React from 'react';

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean; // State of the checkbox
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  label: string; // Label for the checkbox
  required?: boolean; // Optional required flag
  className?: string; // Optional className for additional styling
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  required = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        className="h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
