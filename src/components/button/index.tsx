import React from 'react';
import Loader from '../Loader';

interface ButtonProps {
  type?: "submit" | "reset" | "button"
  onClick?: () => void;
  label?: string;
  isLoading?: boolean;
  variant?: 'submit' | 'cancel'; 
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label = 'Submit',
  isLoading = false,
  variant = 'submit', 
  type = "button"
}) => {
  const buttonClassNames = `
    flex items-center justify-center px-4 py-2 
    ${variant === 'submit' ? 'bg-blue-600' : 'bg-gray-500'} 
    text-white font-bold rounded-md 
    hover:${variant === 'submit' ? 'bg-blue-700' : 'bg-gray-600'} 
    focus:outline-none focus:ring-2 
    focus:ring-${variant === 'submit' ? 'blue' : 'gray'}-500 
    focus:ring-offset-2 transition-colors duration-200
    ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClassNames}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader />
      ) : (
        label
      )}
    </button>
  );
};

export default Button;