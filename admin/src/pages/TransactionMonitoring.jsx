import React, { useState } from 'react'
import { Search, CheckCircle, AlertCircle, Clock, Filter, Flag } from 'lucide-react'

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-400',    bg: 'bg-green-500/10',    border: 'border-green-500/20' },
  pending:   { icon: Clock,       color: 'text-amber-400',    bg: 'bg-amber-500/10',    border: 'border-amber-500/20' },
  failed:    { icon: AlertCircle, color: 'text-red-400',      bg: 'bg-red-500/10',      border: 'border-red-500/20' },
}

const typeColor = {
  contribution: 'text-deepBlue-400',
  payout:       'text-green-400',
  deposit:      'text-amber-400',
  withdrawal:   'text-red-400',
}

export default function TransactionMonitoring() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const transactions = [
    { id: 'TXN001', user: 'Chioma Okafor',  amount: '₦50,000',  type: 'contribution', status: 'completed', timestamp: '2024-04-26 14:30' },
    { id: 'TXN002', user: 'Tunde Adeyemi',  amount: '₦100,000', type: 'payout',       status: 'completed', timestamp: '2024-04-26 13:15' },
    { id: 'TXN003', user: 'Zainab Hassan',  amount: '₦25,000',  type: 'deposit',      status: 'pending',   timestamp: '2024-04-26 12:45' },
    { id: 'TXN004', user: 'Emeka Nwosu',    amount: '₦75,000',  type: 'withdrawal',   status: 'failed',    timestamp: '2024-04-26 11:20' },
    { id: 'TXN005', user: 'Fatima Ibrahim', amount: '₦50,000',  type: 'contribution', status: 'completed', timestamp: '2024-04-26 10:00' },
  ]

  const filtered = transactions.filter(t => {
    const matchSearch = t.id.includes(searchTerm) || t.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filterStatus === 'all' || t.status === filterStatus
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-dark-100">Transaction Monitoring</h1>
        <p className="text-dark-400 text-sm mt-0.5">Monitor and manage platform transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by transaction ID or user..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Txn ID</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-dark-400 uppercase tracking-wider">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filtered.map((txn) => {
                const sc = statusConfig[txn.status] || statusConfig.pending
                const StatusIcon = sc.icon
                return (
                  <tr key={txn.id} className="hover:bg-dark-700/50 transition">
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-deepBlue-400">{txn.id}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-dark-200">{txn.user}</td>
                    <td className="px-5 py-4 text-sm font-bold text-dark-100">{txn.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold capitalize ${typeColor[txn.type] || 'text-dark-400'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${sc.bg} ${sc.border}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${sc.color}`} />
                        <span className={`text-xs font-bold ${sc.color}`}>{txn.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-dark-400">{txn.timestamp}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="p-1.5 hover:bg-amber-500/10 rounded-lg transition text-dark-600 hover:text-amber-400">
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </td>
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
