import React, { useState } from 'react'
import { Search, AlertCircle, Clock, CheckCircle, Filter } from 'lucide-react'

const priorityConfig = {
  critical: { bg: 'bg-red-500/10',      text: 'text-red-400',      border: 'border-red-500/20' },
  high:     { bg: 'bg-amber-500/10',    text: 'text-amber-400',    border: 'border-amber-500/20' },
  medium:   { bg: 'bg-deepBlue-500/10', text: 'text-deepBlue-400', border: 'border-deepBlue-500/20' },
  low:      { bg: 'bg-green-500/10',    text: 'text-green-400',    border: 'border-green-500/20' },
}

const statusConfig = {
  open:        { icon: AlertCircle, color: 'text-red-400' },
  in_progress: { icon: Clock,       color: 'text-amber-400' },
  resolved:    { icon: CheckCircle, color: 'text-green-400' },
}

export default function SupportTickets() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const tickets = [
    { id: 'TKT001', user: 'Chioma Okafor', issue: 'Cannot withdraw funds',          priority: 'high',     status: 'open',        created: '2024-04-26' },
    { id: 'TKT002', user: 'Tunde Adeyemi', issue: 'Group payment not received',     priority: 'critical', status: 'in_progress', created: '2024-04-25' },
    { id: 'TKT003', user: 'Zainab Hassan', issue: 'KYC verification rejected',      priority: 'medium',   status: 'open',        created: '2024-04-24' },
    { id: 'TKT004', user: 'Emeka Nwosu',   issue: 'App crashes on login',           priority: 'high',     status: 'resolved',    created: '2024-04-23' },
  ]

  const filtered = tickets.filter(t => {
    const matchSearch = t.id.includes(searchTerm) || t.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filterStatus === 'all' || t.status === filterStatus
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-dark-100">Support Tickets</h1>
        <p className="text-dark-400 text-sm mt-0.5">Manage user support requests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by ticket ID or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-800 border border-dark-600 text-dark-200 placeholder-dark-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-dark-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-dark-800 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Ticket ID</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Issue</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filtered.map((ticket) => {
                const pc = priorityConfig[ticket.priority] || priorityConfig.medium
                const sc = statusConfig[ticket.status] || statusConfig.open
                const StatusIcon = sc.icon
                return (
                  <tr key={ticket.id} className="hover:bg-dark-700/50 transition cursor-pointer">
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-deepBlue-400">{ticket.id}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-dark-200">{ticket.user}</td>
                    <td className="px-5 py-4 text-sm text-dark-400">{ticket.issue}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${pc.bg} ${pc.text} ${pc.border}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-1.5">
                        <StatusIcon className={`w-4 h-4 ${sc.color}`} />
                        <span className={`text-xs font-semibold ${sc.color}`}>{ticket.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark-400">{ticket.created}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
