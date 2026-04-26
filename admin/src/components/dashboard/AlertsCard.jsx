import React from 'react'
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20' },
  warning:  { icon: AlertCircle,   color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  info:     { icon: Info,          color: 'text-deepBlue-400', bg: 'bg-deepBlue-500/10', border: 'border-deepBlue-500/20' },
}

export default function AlertsCard({ alerts }) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-dark-100">Alerts</h2>
        <span className="text-xs bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full">
          {alerts.length} active
        </span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.info
          const Icon = cfg.icon
          return (
            <div key={alert.id} className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border} flex items-start justify-between`}>
              <div className="flex items-start space-x-3 flex-1">
                <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-sm font-semibold text-dark-200">{alert.title}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{alert.description}</p>
                </div>
              </div>
              <button className="text-dark-600 hover:text-dark-400 ml-2 flex-shrink-0 transition">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
