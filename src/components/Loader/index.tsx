import React from 'react';

interface LoaderProps {
  classNames?: string;
}

const Loader: React.FC<LoaderProps> = ({classNames="border-white h-5 w-5"}) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full  border-b-2  ${classNames}`}></div>
    </div>
  );
};

export default Loader;