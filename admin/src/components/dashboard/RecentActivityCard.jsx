import React from 'react'
import { CheckCircle, AlertCircle, Users, PauseCircle } from 'lucide-react'

const typeConfig = {
  user_verified:       { icon: CheckCircle,  color: 'text-green-400',    bg: 'bg-green-500/10' },
  transaction_flagged: { icon: AlertCircle,  color: 'text-amber-400',    bg: 'bg-amber-500/10' },
  group_created:       { icon: Users,        color: 'text-deepBlue-400', bg: 'bg-deepBlue-500/10' },
  user_suspended:      { icon: PauseCircle,  color: 'text-red-400',      bg: 'bg-red-500/10' },
}

export default function RecentActivityCard({ activities }) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-dark-100">Recent Activity</h2>
        <button className="text-xs text-deepBlue-400 hover:text-deepBlue-300 font-semibold transition">View all</button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const cfg = typeConfig[activity.type] || typeConfig.user_verified
          const Icon = cfg.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dark-700/50 transition">
              <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-200 truncate">{activity.description}</p>
                <p className="text-xs text-dark-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
