import React, { useState } from 'react'
import { Search, Users, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  active:    { bg: 'bg-green-500/10',    text: 'text-green-400',    border: 'border-green-500/20' },
  disputed:  { bg: 'bg-amber-500/10',    text: 'text-amber-400',    border: 'border-amber-500/20' },
  completed: { bg: 'bg-dark-700',        text: 'text-dark-400',     border: 'border-dark-600' },
}

export default function GroupManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const groups = [
    { id: 1, name: 'Ajo Warriors',        members: 12, totalSavings: '₦450,000', status: 'active',    nextPayout: '2024-04-30' },
    { id: 2, name: 'Women Empowerment',   members: 8,  totalSavings: '₦320,000', status: 'active',    nextPayout: '2024-05-15' },
    { id: 3, name: 'Business Boost',      members: 15, totalSavings: '₦680,000', status: 'disputed',  nextPayout: '2024-06-01' },
    { id: 4, name: 'Community Fund',      members: 10, totalSavings: '₦400,000', status: 'completed', nextPayout: 'N/A' },
  ]

  const filtered = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-dark-100">Group Management</h1>
        <p className="text-dark-400 text-sm mt-0.5">Monitor and manage savings groups</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-800 border border-dark-600 text-dark-200 placeholder-dark-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((group) => {
          const sc = statusConfig[group.status] || statusConfig.active
          return (
            <div key={group.id} className="bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-dark-500 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-bold text-dark-100">{group.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                  {group.status}
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center space-x-2 text-dark-400">
                  <Users className="w-4 h-4 text-deepBlue-400" />
                  <span className="text-sm">{group.members} members</span>
                </div>
                <div className="flex items-center space-x-2 text-dark-400">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-dark-200">{group.totalSavings}</span>
                </div>
                <div className="flex items-center space-x-2 text-dark-400">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">Next payout: {group.nextPayout}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/admin/groups/${group.id}`)}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-dark-700 hover:bg-deepBlue-600 border border-dark-600 hover:border-deepBlue-500 text-dark-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-semibold">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
