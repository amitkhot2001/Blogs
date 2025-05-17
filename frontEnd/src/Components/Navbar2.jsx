// Navbar.js
import React, { useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isMenuOpen, toggleMenu, handleLogout }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        toggleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <nav className="bg-white shadow-xl py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center relative">
        {/* Logo/Title with gradient accent */}
        <div className="text-2xl font-bold text-gray-800 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Author Dashboard
          </span>
        </div>

        {/* Mobile Menu Toggle Button with pseudo-ripple effect */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100 relative overflow-hidden transition-colors duration-200"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="absolute inset-0 rounded-full bg-gray-200/20 opacity-0 active:opacity-30 active:scale-150 transition-all duration-300" />
          {isMenuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>

        {/* Desktop Menu with subtle hover animations */}
        <ul className="hidden lg:flex lg:items-center lg:space-x-6">
          {['Home', 'Blogs', 'Profile', 'Settings'].map((link) => (
            <li key={link} className="relative group">
              <a
                href={`/${link.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-sm uppercase tracking-wide relative"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${link.toLowerCase()}`);
                }}
              >
                {link}
                {/* Underline animation on hover */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-px"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu - Sidebar style with overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          ref={menuRef}
        >
          {/* Overlay for background dimming */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => toggleMenu(false)}
          />
          {/* Sidebar Menu */}
          <div
            className={`absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-2xl rounded-r-lg overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => toggleMenu(false)}
                className="text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="divide-y divide-gray-100">
              {['Home', 'Blogs', 'Profile', 'Settings'].map((link) => (
                <li
                  key={link}
                  className="px-4 py-4 hover:bg-gray-50 transition-colors duration-200 relative overflow-hidden"
                >
                  <a
                    href={`/${link.toLowerCase()}`}
                    className="block text-gray-700 hover:text-blue-600 font-medium text-base relative"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${link.toLowerCase()}`);
                      toggleMenu(false);
                    }}
                  >
                    {link}
                    {/* Pseudo-ripple effect on active state */}
                    <span className="absolute inset-0 bg-blue-100/20 opacity-0 active:opacity-30 active:scale-110 transition-all duration-300" />
                  </a>
                </li>
              ))}
              <li className="px-4 py-4 hover:bg-gray-50 transition-colors duration-200">
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu(false);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium w-full text-base shadow-md hover:shadow-lg hover:-translate-y-px"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;