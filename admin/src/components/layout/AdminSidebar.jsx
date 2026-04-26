import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Activity, TrendingUp, MessageSquare,
  BarChart3, FileText, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminSidebar({ isOpen, onToggle }) {
  const location = useLocation()
  const { logout, adminRole } = useAdminAuth()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard',        path: '/admin/dashboard',    roles: ['super_admin', 'moderator', 'support_agent'] },
    { icon: Users,           label: 'User Management',  path: '/admin/users',        roles: ['super_admin', 'moderator'] },
    { icon: Activity,        label: 'Groups',           path: '/admin/groups',       roles: ['super_admin', 'moderator'] },
    { icon: TrendingUp,      label: 'Transactions',     path: '/admin/transactions', roles: ['super_admin', 'moderator', 'support_agent'] },
    { icon: MessageSquare,   label: 'Support Tickets',  path: '/admin/support',      roles: ['super_admin', 'moderator', 'support_agent'] },
    { icon: BarChart3,       label: 'Analytics',        path: '/admin/analytics',    roles: ['super_admin', 'moderator'] },
    { icon: FileText,        label: 'Audit Logs',       path: '/admin/audit-logs',   roles: ['super_admin'] },
    { icon: Settings,        label: 'Settings',         path: '/admin/settings',     roles: ['super_admin'] },
  ]

  const filtered = menuItems.filter(item => item.roles.includes(adminRole))
  const isActive = (path) => location.pathname === path

  return (
    <div className={`${isOpen ? 'w-64' : 'w-[72px]'} bg-dark-950 border-r border-dark-800 flex flex-col h-screen transition-all duration-300 flex-shrink-0`}>

      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-deepBlue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <span className="text-white font-black text-base tracking-tight">AjoSave</span>
              <span className="block text-green-400 text-[10px] font-semibold tracking-widest uppercase -mt-0.5">Admin</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-dark-800 rounded-lg transition text-dark-400 hover:text-dark-200"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filtered.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : ''}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                active
                  ? 'bg-deepBlue-600 text-white shadow-lg shadow-deepBlue-900/50'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-dark-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
              {active && isOpen && (
                <span className="ml-auto w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-dark-800">
        <button
          onClick={logout}
          title={!isOpen ? 'Logout' : ''}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-dark-400 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  )
}
