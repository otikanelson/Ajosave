import React, { useState } from 'react'
import { Search, MoreVertical, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'

const kycConfig = {
  verified: { icon: CheckCircle, bg: 'bg-green-500/10',    text: 'text-green-400',    border: 'border-green-500/20' },
  pending:  { icon: Clock,       bg: 'bg-amber-500/10',    text: 'text-amber-400',    border: 'border-amber-500/20' },
  rejected: { icon: XCircle,     bg: 'bg-red-500/10',      text: 'text-red-400',      border: 'border-red-500/20' },
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const users = [
    { id: 1, name: 'Chioma Okafor',  phone: '+234 801 234 5678', kycStatus: 'verified', accountStatus: 'active',    joinDate: '2024-01-15' },
    { id: 2, name: 'Tunde Adeyemi',  phone: '+234 802 345 6789', kycStatus: 'pending',  accountStatus: 'active',    joinDate: '2024-02-20' },
    { id: 3, name: 'Zainab Hassan',  phone: '+234 803 456 7890', kycStatus: 'verified', accountStatus: 'suspended', joinDate: '2024-01-10' },
    { id: 4, name: 'Emeka Nwosu',    phone: '+234 804 567 8901', kycStatus: 'rejected', accountStatus: 'active',    joinDate: '2024-03-05' },
    { id: 5, name: 'Fatima Ibrahim', phone: '+234 805 678 9012', kycStatus: 'verified', accountStatus: 'active',    joinDate: '2024-02-28' },
  ]

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm)
    const matchFilter = filterStatus === 'all' || u.kycStatus === filterStatus
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-dark-100">User Management</h1>
        <p className="text-dark-400 text-sm mt-0.5">Manage and verify user accounts</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by name or phone..."
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
            <option value="all">All KYC Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">KYC</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-dark-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filtered.map((user) => {
                const kyc = kycConfig[user.kycStatus] || kycConfig.pending
                const KycIcon = kyc.icon
                return (
                  <tr key={user.id} className="hover:bg-dark-700/50 transition">
                    <td className="px-5 py-4 text-sm font-semibold text-dark-100">{user.name}</td>
                    <td className="px-5 py-4 text-sm text-dark-400">{user.phone}</td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${kyc.bg} ${kyc.border}`}>
                        <KycIcon className={`w-3.5 h-3.5 ${kyc.text}`} />
                        <span className={`text-xs font-bold capitalize ${kyc.text}`}>{user.kycStatus}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.accountStatus === 'active'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark-400">{user.joinDate}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="p-1.5 hover:bg-dark-600 rounded-lg transition text-dark-400 hover:text-dark-200">
                        <MoreVertical className="w-4 h-4" />
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
