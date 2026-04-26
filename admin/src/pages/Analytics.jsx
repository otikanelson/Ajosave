import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Download } from 'lucide-react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month')

  const cards = [
    { title: 'Total Users',        value: '12,543', change: '+12.5%', icon: Users,      color: 'blue' },
    { title: 'Total Savings',      value: '₦45.2M', change: '+23.1%', icon: DollarSign, color: 'green' },
    { title: 'Active Groups',      value: '2,341',  change: '+8.2%',  icon: BarChart3,  color: 'amber' },
    { title: 'Transaction Volume', value: '28,456', change: '+15.3%', icon: TrendingUp, color: 'blue' },
  ]

  const colorMap = {
    blue:  { bg: 'bg-deepBlue-500/10', icon: 'text-deepBlue-400' },
    green: { bg: 'bg-green-500/10',    icon: 'text-green-400' },
    amber: { bg: 'bg-amber-500/10',    icon: 'text-amber-400' },
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-100">Analytics</h1>
          <p className="text-dark-400 text-sm mt-0.5">Platform performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-dark-800 border border-dark-600 text-dark-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center space-x-2 bg-deepBlue-600 hover:bg-deepBlue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const c = colorMap[card.color] || colorMap.blue
          const Icon = card.icon
          return (
            <div key={i} className="bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-dark-600 transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm font-semibold">{card.title}</p>
                  <p className="text-2xl font-black text-dark-100 mt-2">{card.value}</p>
                  <p className="text-green-400 text-xs font-bold mt-1">{card.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${c.bg}`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
          <h2 className="text-base font-bold text-dark-100 mb-4">Daily Transaction Volume</h2>
          <div className="h-56 bg-dark-900 rounded-xl border border-dark-700 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-dark-600 mx-auto mb-2" />
              <p className="text-dark-500 text-sm">Connect Recharts to display chart</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
          <h2 className="text-base font-bold text-dark-100 mb-4">User Growth</h2>
          <div className="h-56 bg-dark-900 rounded-xl border border-dark-700 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-dark-600 mx-auto mb-2" />
              <p className="text-dark-500 text-sm">Connect Recharts to display chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Breakdown */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-dark-100 mb-4">KYC Verification Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Verified',  value: '8,234', pct: '65%', color: 'bg-green-500' },
            { label: 'Pending',   value: '2,341', pct: '19%', color: 'bg-amber-500' },
            { label: 'Rejected',  value: '1,968', pct: '16%', color: 'bg-red-500' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-black text-dark-100">{item.value}</p>
              <p className="text-dark-400 text-sm mt-1">{item.label}</p>
              <div className="mt-2 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }}></div>
              </div>
              <p className="text-dark-500 text-xs mt-1">{item.pct}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
