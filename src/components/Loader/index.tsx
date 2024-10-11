import React from 'react';

interface LoaderProps {
  classNames: string;
}

const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${props.classNames}`}></div>
    </div>
  );
};

export default Loader;