import React, { useState } from 'react'
import { Save, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    maxTransactionLimit: '500000',
    minTransactionLimit: '1000',
    kycRequired: true,
    maintenanceMode: false,
    notificationsEnabled: true,
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    // TODO: PUT /api/admin/settings
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ id, checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-deepBlue-600' : 'bg-dark-600'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  )

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-dark-100">Platform Settings</h1>
        <p className="text-dark-400 text-sm mt-0.5">Configure platform behaviour and policies</p>
      </div>

      {/* Transaction Limits */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-dark-100 mb-4">Transaction Limits</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-1.5">Maximum Transaction Limit (₦)</label>
            <input
              type="number"
              value={settings.maxTransactionLimit}
              onChange={(e) => handleChange('maxTransactionLimit', e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 text-dark-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-1.5">Minimum Transaction Limit (₦)</label>
            <input
              type="number"
              value={settings.minTransactionLimit}
              onChange={(e) => handleChange('minTransactionLimit', e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 text-dark-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* KYC */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-dark-100 mb-4">KYC Requirements</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-dark-200">Require KYC verification</p>
            <p className="text-xs text-dark-500 mt-0.5">All users must complete KYC before transacting</p>
          </div>
          <Toggle id="kycRequired" checked={settings.kycRequired} onChange={(v) => handleChange('kycRequired', v)} />
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-dark-100 mb-4">Maintenance Mode</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-dark-200">Enable maintenance mode</p>
            <p className="text-xs text-dark-500 mt-0.5">Platform will be unavailable to regular users</p>
          </div>
          <Toggle id="maintenanceMode" checked={settings.maintenanceMode} onChange={(v) => handleChange('maintenanceMode', v)} />
        </div>
        {settings.maintenanceMode && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              Maintenance mode is active. Regular users cannot access the platform.
            </p>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-dark-100 mb-4">Notifications</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-dark-200">Enable user notifications</p>
            <p className="text-xs text-dark-500 mt-0.5">Send SMS and email notifications to users</p>
          </div>
          <Toggle id="notificationsEnabled" checked={settings.notificationsEnabled} onChange={(v) => handleChange('notificationsEnabled', v)} />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-deepBlue-600 hover:bg-deepBlue-500 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
        {saved && (
          <div className="flex items-center space-x-1.5 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Saved successfully</span>
          </div>
        )}
      </div>
    </div>
  )
}
