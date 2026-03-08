import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Wallet, Users, Building2, Bell, Settings, HelpCircle, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SettingsSidebar = ({ open, onClose, user, onLogout }) => {
  const navigate = useNavigate();
  const nav = (path) => { onClose(); navigate(path); };

  const items = [
    { icon: User, label: 'My Profile', path: null },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Users, label: 'My Groups', path: '/groups' },
    { icon: Building2, label: 'Bank Accounts', path: null },
    { icon: Bell, label: 'Notifications', path: null },
    { icon: Settings, label: 'Settings', path: null },
    { icon: HelpCircle, label: 'Help & Support', path: null },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 left-0 w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`} style={{ height: '100dvh' }}>
        {/* Header */}
        <div className="p-5 pt-12 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ backgroundColor: '#0a79f0' }}>
              {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {items.map(({ icon: Icon, label, path }) => (
            <button key={label} onClick={() => path ? nav(path) : onClose()}
              className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0a79f015' }}>
                <Icon className="w-5 h-5" style={{ color: '#0a79f0' }} />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-800">{label}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </nav>

        {/* Logout — always visible at bottom */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white">
          <button onClick={onLogout}
            className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-red-50 transition">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-red-500">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    setSidebarOpen(false);
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <SettingsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onLogout={handleLogout} />
      <div className="bg-white border-b border-deepBlue-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-deepBlue-600">AjoSave</h1>
          {user && (
            <button onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 hover:bg-deepBlue-50 rounded-xl px-2 py-1 transition">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: '#0a79f0' }}>
                {user.firstName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-deepBlue-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-deepBlue-500">{user.email}</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
