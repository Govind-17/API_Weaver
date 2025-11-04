import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaDatabase, 
  FaCog, 
  FaFolder, 
  FaSignInAlt, 
  FaUserPlus,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/connect', label: 'Connect DB', icon: FaDatabase },
    { path: '/generate', label: 'Generate API', icon: FaCog },
    { path: '/projects', label: 'Projects', icon: FaFolder },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AW</span>
              </div>
              <span className="text-xl font-bold text-gray-800">API Weaver</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaUser className="w-4 h-4" />
                  <span className="hidden sm:block">{user?.username}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.username}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span className="hidden sm:block">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaUserPlus className="w-4 h-4" />
                  <span className="hidden sm:block">Register</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSignInAlt className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
