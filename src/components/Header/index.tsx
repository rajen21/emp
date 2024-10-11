import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <NavLink to="/" className="hover:text-gray-400">Employee Manangement</NavLink>
        </div>
        <nav className="hidden md:flex space-x-4">
          <NavLink to="/" className="hover:text-gray-400">Home</NavLink>
          <NavLink to="/workspaces" className="hover:text-gray-400">Workspaces</NavLink>
          <NavLink to="/employee-list" className="hover:text-gray-400">Employees</NavLink>
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                onClick={toggleDropdown}
              >
                Options
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</NavLink>
                  <NavLink to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</NavLink>
                </div>
              </div>
            )}
          </div>
        </nav>
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded focus:outline-none focus:bg-gray-700"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-gray-700">
          <div className="px-4 py-2">
            <NavLink to="/" className="block text-gray-300 hover:bg-gray-600 hover:text-white px-2 py-1 rounded">Home</NavLink>
            <NavLink to="/workspaces" className="block text-gray-300 hover:bg-gray-600 hover:text-white px-2 py-1 rounded">Workspaces</NavLink>
            <NavLink to="/employee-list" className="block text-gray-300 hover:bg-gray-600 hover:text-white px-2 py-1 rounded">Employees</NavLink>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
