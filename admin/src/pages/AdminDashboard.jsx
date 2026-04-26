import React, { useState } from 'react'
import { Users, TrendingUp, AlertCircle, DollarSign, Activity, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/dashboard/StatCard'
import RecentActivityCard from '../components/dashboard/RecentActivityCard'
import AlertsCard from '../components/dashboard/AlertsCard'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('today')
  const { adminUser } = useAdminAuth()
  const navigate = useNavigate()

  const stats = [
    { title: 'Total Users',        value: '12,543', change: '+12.5%', icon: Users,      color: 'blue' },
    { title: 'Active Groups',      value: '2,341',  change: '+8.2%',  icon: Activity,   color: 'green' },
    { title: 'Total Savings',      value: '₦45.2M', change: '+23.1%', icon: DollarSign, color: 'amber' },
    { title: 'Transactions (24h)', value: '1,234',  change: '+5.4%',  icon: TrendingUp, color: 'green' },
  ]

  const recentActivities = [
    { id: 1, type: 'user_verified',       description: 'Chioma Okafor KYC verified',       time: '2 mins ago' },
    { id: 2, type: 'transaction_flagged', description: 'Suspicious transaction flagged',    time: '15 mins ago' },
    { id: 3, type: 'group_created',       description: 'New group "Ajo Warriors" created',  time: '1 hour ago' },
    { id: 4, type: 'user_suspended',      description: 'User account suspended',            time: '2 hours ago' },
  ]

  const alerts = [
    { id: 1, severity: 'critical', title: 'High Transaction Volume',     description: 'Volume 40% above normal threshold' },
    { id: 2, severity: 'warning',  title: 'Pending KYC Verifications',   description: '234 users awaiting KYC approval' },
    { id: 3, severity: 'info',     title: 'Scheduled Maintenance',       description: 'Tonight at 2:00 AM WAT' },
  ]

  const quickActions = [
    { label: 'Manage Users',   icon: Users,        path: '/admin/users',        color: 'text-deepBlue-400', bg: 'bg-deepBlue-500/10' },
    { label: 'View Groups',    icon: Activity,     path: '/admin/groups',       color: 'text-green-400',    bg: 'bg-green-500/10' },
    { label: 'Transactions',   icon: TrendingUp,   path: '/admin/transactions', color: 'text-amber-400',    bg: 'bg-amber-500/10' },
    { label: 'Support',        icon: AlertCircle,  path: '/admin/support',      color: 'text-red-400',      bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-100">Dashboard</h1>
          <p className="text-dark-400 text-sm mt-0.5">
            Welcome back, <span className="text-deepBlue-400 font-semibold">{adminUser?.name}</span>
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-dark-800 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepBlue-500 w-fit"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Activity + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={recentActivities} />
        </div>
        <div>
          <AlertsCard alerts={alerts} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-dark-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center p-4 bg-dark-900 border border-dark-700 rounded-xl hover:border-dark-500 hover:bg-dark-700 transition-all duration-200 group"
              >
                <div className={`p-3 rounded-xl ${action.bg} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-sm font-semibold text-dark-300 group-hover:text-dark-100 transition">{action.label}</span>
                <ArrowRight className="w-3 h-3 text-dark-600 group-hover:text-dark-400 mt-1 transition" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
