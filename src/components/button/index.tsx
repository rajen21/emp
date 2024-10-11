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
        <Loader classNames='' />
      ) : (
        label
      )}
    </button>
  );
};

export default Button;




// import React from 'react';

// interface ButtonProps {
//   onClick: () => void;
//   label?: string;
//   isLoading?: boolean;
// }

// const Button: React.FC<ButtonProps> = ({ onClick, label = 'Add Workspace', isLoading = false }) => {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${isLoading ? 'cursor-not-allowed opacity-50' : ''
//         }`}
//       disabled={isLoading}
//     >
//       {isLoading ? (
//         <svg
//           className="animate-spin h-5 w-5 mr-3 text-white"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             strokeWidth="4"
//           ></circle>
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//           ></path>
//         </svg>
//       ) : (
//         label
//       )}
//     </button>
//   );
// };

// export default Button;
