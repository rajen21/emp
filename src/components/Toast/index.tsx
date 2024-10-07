import React, { useState, useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'info' | 'error';
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, show, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const toastStyles = {
    success: 'bg-green-500 text-white',
    info: 'bg-blue-500 text-white',
    error: 'bg-red-500 text-white',
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-5 right-5 px-6 py-4 rounded-lg shadow-lg ${toastStyles[type]}`}>
      <div className="flex items-center">
        <div className="mr-4">
          {type === 'success' && (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'info' && (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 18.5A6.5 6.5 0 105.5 12 6.5 6.5 0 0012 18.5z"
              />
            </svg>
          )}
          {type === 'error' && (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div className="text-white">{message}</div>
      </div>
    </div>
  );
};

export default Toast;