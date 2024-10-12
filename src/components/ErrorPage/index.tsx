import React from 'react';

// interface ErrorPageProps {
//   type: 'access-denied' | 'not-found';
// }

const ErrorPage: React.FC = () => {
  const renderMessage = () => {
    // switch (type) {
    //   case 'access-denied':
    //     return {
    //       title: 'Access Denied',
    //       description: 'You do not have permission to view this page.',
    //       buttonLabel: 'Go Back Home',
    //       buttonAction: () => window.location.href = '/' // Redirect home
    //     };
    //   case 'not-found':
    //     return {
    //       title: 'Page Not Found',
    //       description: 'The page you are looking for does not exist.',
    //       buttonLabel: 'Go to Homepage',
    //       buttonAction: () => window.location.href = '/' // Redirect home
    //     };
    //   default:
    //     return {
    //       title: 'Error',
    //       description: 'An unknown error occurred.',
    //       buttonLabel: 'Go Back',
    //       buttonAction: () => window.history.back() // Go back to the previous page
    //     };
    // }
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      buttonLabel: 'Go to Homepage',
      buttonAction: () => window.location.href = '/' // Redirect home
    };
  };

  const { title, description, buttonLabel, buttonAction } = renderMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 text-lg mb-6">{description}</p>
        <button
          onClick={buttonAction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default {path: "*", element: <ErrorPage /> };
