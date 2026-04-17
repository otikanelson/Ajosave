import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-deepBlue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src={logo} 
              alt="AjoSave Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-deepBlue-800">AjoSave</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-deepBlue-600 hover:text-deepBlue-800 font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/auth')}
              className="text-deepBlue-600 hover:text-deepBlue-800 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors shadow-sm"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-deepBlue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-deepBlue-100 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="text-deepBlue-600 hover:text-deepBlue-800 font-medium text-left px-2 py-1 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-deepBlue-100">
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="text-deepBlue-600 hover:text-deepBlue-800 font-medium text-left px-2 py-2 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="bg-deepBlue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors text-center"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;