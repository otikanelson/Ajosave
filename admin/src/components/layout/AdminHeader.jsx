import React, { useState } from 'react'
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import NotificationsDropdown from '../common/NotificationsDropdown'

export default function AdminHeader({ onMenuClick }) {
  const { adminUser, logout } = useAdminAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const roleLabel = {
    super_admin: 'Super Admin',
    moderator: 'Moderator',
    support_agent: 'Support Agent',
  }

  return (
    <header className="bg-dark-900 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-dark-800 rounded-lg transition text-dark-300 hover:text-dark-100"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Right */}
      <div className="flex items-center space-x-3">
        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-dark-800 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-deepBlue-700 rounded-full flex items-center justify-center ring-2 ring-deepBlue-500">
              <User className="w-4 h-4 text-deepBlue-200" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-dark-100">{adminUser?.name}</p>
              <p className="text-xs text-green-400">{roleLabel[adminUser?.role] || adminUser?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-dark-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-dark-800 rounded-xl shadow-2xl border border-dark-700 z-50 animate-fade-in">
              <div className="p-4 border-b border-dark-700">
                <p className="text-sm font-semibold text-dark-100">{adminUser?.name}</p>
                <p className="text-xs text-dark-400 mt-0.5">{adminUser?.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { logout(); setShowUserMenu(false) }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
