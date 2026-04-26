import React, { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'

const actionConfig = {
  user_suspended:       { bg: 'bg-red-500/10',      text: 'text-red-400',      border: 'border-red-500/20' },
  kyc_approved:         { bg: 'bg-green-500/10',    text: 'text-green-400',    border: 'border-green-500/20' },
  transaction_reversed: { bg: 'bg-amber-500/10',    text: 'text-amber-400',    border: 'border-amber-500/20' },
  group_modified:       { bg: 'bg-deepBlue-500/10', text: 'text-deepBlue-400', border: 'border-deepBlue-500/20' },
  setting_changed:      { bg: 'bg-dark-700',        text: 'text-dark-300',     border: 'border-dark-600' },
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  const logs = [
    { id: 1, admin: 'Admin User', action: 'user_suspended',       entity: 'Chioma Okafor',    timestamp: '2024-04-26 14:30', details: 'Suspended for suspicious activity' },
    { id: 2, admin: 'Admin User', action: 'kyc_approved',         entity: 'Tunde Adeyemi',    timestamp: '2024-04-26 13:15', details: 'KYC verification approved' },
    { id: 3, admin: 'Admin User', action: 'transaction_reversed', entity: 'TXN001',           timestamp: '2024-04-26 12:45', details: 'Transaction reversed - user request' },
    { id: 4, admin: 'Admin User', action: 'group_modified',       entity: 'Ajo Warriors',     timestamp: '2024-04-26 11:20', details: 'Group settings updated' },
    { id: 5, admin: 'Admin User', action: 'setting_changed',      entity: 'Transaction Limit',timestamp: '2024-04-26 10:00', details: 'Changed from ₦500K to ₦1M' },
  ]

  const filtered = logs.filter(l => {
    const matchSearch = l.admin.toLowerCase().includes(searchTerm.toLowerCase()) || l.entity.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filterAction === 'all' || l.action === filterAction
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-100">Audit Logs</h1>
          <p className="text-dark-400 text-sm mt-0.5">Track all administrative actions</p>
        </div>
        <button className="flex items-center space-x-2 bg-dark-800 border border-dark-600 hover:border-dark-500 text-dark-300 hover:text-dark-100 text-sm font-semibold px-4 py-2 rounded-lg transition w-fit">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by admin or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-800 border border-dark-600 text-dark-200 placeholder-dark-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-dark-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-dark-800 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
          >
            <option value="all">All Actions</option>
            <option value="user_suspended">User Suspended</option>
            <option value="kyc_approved">KYC Approved</option>
            <option value="transaction_reversed">Transaction Reversed</option>
            <option value="group_modified">Group Modified</option>
            <option value="setting_changed">Setting Changed</option>
          </select>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Admin</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Entity</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Details</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filtered.map((log) => {
                const ac = actionConfig[log.action] || actionConfig.setting_changed
                return (
                  <tr key={log.id} className="hover:bg-dark-700/50 transition">
                    <td className="px-5 py-4 text-sm font-semibold text-dark-200">{log.admin}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${ac.bg} ${ac.text} ${ac.border}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark-300">{log.entity}</td>
                    <td className="px-5 py-4 text-sm text-dark-400">{log.details}</td>
                    <td className="px-5 py-4 text-xs text-dark-500 font-mono">{log.timestamp}</td>
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
