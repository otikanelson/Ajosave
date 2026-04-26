import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  green:   { bg: 'bg-green-500/10',   icon: 'text-green-400',   ring: 'ring-green-500/20' },
  blue:    { bg: 'bg-deepBlue-500/10', icon: 'text-deepBlue-400', ring: 'ring-deepBlue-500/20' },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   ring: 'ring-amber-500/20' },
  red:     { bg: 'bg-red-500/10',     icon: 'text-red-400',     ring: 'ring-red-500/20' },
}

export default function StatCard({ title, value, change, icon: Icon, color = 'blue' }) {
  const c = colorMap[color] || colorMap.blue
  const isPositive = change?.startsWith('+')

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-dark-600 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-dark-400 text-sm font-semibold">{title}</p>
          <p className="text-2xl font-black text-dark-100 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2 space-x-1">
              {isPositive
                ? <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              }
              <span className={`text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
              <span className="text-dark-500 text-xs">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ring-1 ${c.ring}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  )
}
