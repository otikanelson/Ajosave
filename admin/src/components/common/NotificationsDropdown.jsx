import React, { useState, useRef, useEffect } from 'react'
import {
  Bell, X, CheckCheck, AlertTriangle, AlertCircle,
  Users, TrendingUp, MessageSquare, Info, Settings
} from 'lucide-react'

const mockNotifications = [
  {
    id: 1,
    type: 'alert',
    severity: 'critical',
    title: 'High Transaction Volume',
    message: 'Transaction volume is 40% above normal threshold. Immediate review recommended.',
    time: '2 mins ago',
    read: false,
  },
  {
    id: 2,
    type: 'kyc',
    severity: 'warning',
    title: 'KYC Pending Review',
    message: '234 users are awaiting KYC approval. Oldest submission is 3 days old.',
    time: '15 mins ago',
    read: false,
  },
  {
    id: 3,
    type: 'ticket',
    severity: 'warning',
    title: 'New Support Ticket',
    message: 'Tunde Adeyemi opened a critical ticket: "Group payment not received".',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 4,
    type: 'group',
    severity: 'info',
    title: 'Group Dispute Reported',
    message: 'Members of "Business Boost" have reported a contribution conflict.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'transaction',
    severity: 'info',
    title: 'Large Withdrawal Flagged',
    message: 'Withdrawal of ₦2,500,000 by Emeka Nwosu is pending review.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 6,
    type: 'system',
    severity: 'info',
    title: 'Scheduled Maintenance',
    message: 'Platform maintenance is scheduled for tonight at 2:00 AM WAT.',
    time: '5 hours ago',
    read: true,
  },
]

const typeConfig = {
  alert:       { icon: AlertTriangle, bg: 'bg-red-500/10',      color: 'text-red-400' },
  kyc:         { icon: Users,         bg: 'bg-amber-500/10',    color: 'text-amber-400' },
  ticket:      { icon: MessageSquare, bg: 'bg-deepBlue-500/10', color: 'text-deepBlue-400' },
  group:       { icon: Users,         bg: 'bg-amber-500/10',    color: 'text-amber-400' },
  transaction: { icon: TrendingUp,    bg: 'bg-green-500/10',    color: 'text-green-400' },
  system:      { icon: Settings,      bg: 'bg-dark-700',        color: 'text-dark-400' },
}

const severityDot = {
  critical: 'bg-red-500',
  warning:  'bg-amber-500',
  info:     'bg-deepBlue-500',
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all') // all | unread
  const ref = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-lg transition ${
          open ? 'bg-dark-700 text-dark-100' : 'hover:bg-dark-800 text-dark-300 hover:text-dark-100'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-dark-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 animate-fade-in overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-dark-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/20 font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center space-x-1 text-xs text-deepBlue-400 hover:text-deepBlue-300 font-semibold transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-dark-700">
            {['all', 'unread'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2.5 text-xs font-bold capitalize transition border-b-2 ${
                  filter === f
                    ? 'border-deepBlue-500 text-deepBlue-400'
                    : 'border-transparent text-dark-500 hover:text-dark-300'
                }`}
              >
                {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-dark-700 rounded-full mb-3">
                  <Bell className="w-6 h-6 text-dark-500" />
                </div>
                <p className="text-sm font-semibold text-dark-400">No notifications</p>
                <p className="text-xs text-dark-600 mt-1">You're all caught up!</p>
              </div>
            ) : (
              displayed.map((notif) => {
                const cfg = typeConfig[notif.type] || typeConfig.system
                const Icon = cfg.icon
                return (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3.5 border-b border-dark-700/50 last:border-b-0 cursor-pointer transition group ${
                      notif.read ? 'hover:bg-dark-700/30' : 'bg-deepBlue-500/5 hover:bg-deepBlue-500/10'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0 mt-0.5 relative`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                      {!notif.read && (
                        <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${severityDot[notif.severity] || 'bg-deepBlue-500'}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-bold leading-tight ${notif.read ? 'text-dark-300' : 'text-dark-100'}`}>
                          {notif.title}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(notif.id) }}
                          className="text-dark-600 hover:text-dark-400 transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-dark-500 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-dark-600 mt-1.5 font-semibold">{notif.time}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-dark-700 bg-dark-900/50">
            <button className="w-full text-xs text-deepBlue-400 hover:text-deepBlue-300 font-semibold transition text-center">
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
