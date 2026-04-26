import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, TrendingUp, Calendar, Clock, CheckCircle,
  AlertTriangle, MoreVertical, Send, Flag, Crown, ChevronDown, ChevronUp
} from 'lucide-react'

// Mock data — replace with API call using `id`
const mockGroup = {
  id: 1,
  name: 'Ajo Warriors',
  description: 'A trusted savings group for young professionals in Lagos. Monthly contributions with rotating payouts.',
  status: 'active',
  contributionAmount: '₦50,000',
  frequency: 'Monthly',
  totalSavings: '₦600,000',
  nextPayout: '2024-04-30',
  createdAt: '2024-01-10',
  cycleProgress: 8, // out of 12
  admin: 'Chioma Okafor',
  members: [
    { id: 1, name: 'Chioma Okafor',  phone: '+234 801 234 5678', contributed: '₦400,000', status: 'paid',    payoutReceived: true,  position: 1, isAdmin: true },
    { id: 2, name: 'Tunde Adeyemi',  phone: '+234 802 345 6789', contributed: '₦400,000', status: 'paid',    payoutReceived: false, position: 2, isAdmin: false },
    { id: 3, name: 'Zainab Hassan',  phone: '+234 803 456 7890', contributed: '₦350,000', status: 'partial', payoutReceived: false, position: 3, isAdmin: false },
    { id: 4, name: 'Emeka Nwosu',    phone: '+234 804 567 8901', contributed: '₦400,000', status: 'paid',    payoutReceived: false, position: 4, isAdmin: false },
    { id: 5, name: 'Fatima Ibrahim', phone: '+234 805 678 9012', contributed: '₦400,000', status: 'paid',    payoutReceived: false, position: 5, isAdmin: false },
    { id: 6, name: 'Kemi Adebayo',   phone: '+234 806 789 0123', contributed: '₦0',       status: 'missed',  payoutReceived: false, position: 6, isAdmin: false },
  ],
  transactions: [
    { id: 'TXN001', user: 'Chioma Okafor',  type: 'contribution', amount: '₦50,000', date: '2024-04-01', status: 'completed' },
    { id: 'TXN002', user: 'Tunde Adeyemi',  type: 'contribution', amount: '₦50,000', date: '2024-04-01', status: 'completed' },
    { id: 'TXN003', user: 'Zainab Hassan',  type: 'contribution', amount: '₦25,000', date: '2024-04-02', status: 'completed' },
    { id: 'TXN004', user: 'Chioma Okafor',  type: 'payout',       amount: '₦300,000',date: '2024-03-15', status: 'completed' },
    { id: 'TXN005', user: 'Kemi Adebayo',   type: 'contribution', amount: '₦50,000', date: '2024-03-01', status: 'failed' },
  ],
}

const statusConfig = {
  active:    { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
  disputed:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  completed: { bg: 'bg-dark-700',      text: 'text-dark-400',   border: 'border-dark-600' },
}

const memberStatusConfig = {
  paid:    { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  label: 'Paid' },
  partial: { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20',  label: 'Partial' },
  missed:  { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20',    label: 'Missed' },
}

const txnTypeColor = {
  contribution: 'text-deepBlue-400',
  payout:       'text-green-400',
}

const txnStatusConfig = {
  completed: { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  failed:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  pending:   { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
}

export default function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('members')
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [disputeNote, setDisputeNote] = useState('')
  const [expandedMember, setExpandedMember] = useState(null)

  const group = mockGroup // TODO: fetch by id
  const sc = statusConfig[group.status] || statusConfig.active
  const progressPct = Math.round((group.cycleProgress / 12) * 100)

  const tabs = [
    { key: 'members',      label: 'Members',      count: group.members.length },
    { key: 'transactions', label: 'Transactions',  count: group.transactions.length },
    { key: 'rotation',     label: 'Payout Rotation' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/admin/groups')}
          className="p-2 hover:bg-dark-800 rounded-lg transition text-dark-400 hover:text-dark-200 flex-shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-dark-100">{group.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
              {group.status}
            </span>
          </div>
          <p className="text-dark-400 text-sm mt-1">{group.description}</p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowDisputeModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-lg transition text-sm font-semibold"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flag Dispute</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Members',           value: group.members.length,      icon: Users,      color: 'text-deepBlue-400', bg: 'bg-deepBlue-500/10' },
          { label: 'Total Savings',     value: group.totalSavings,        icon: TrendingUp, color: 'text-green-400',    bg: 'bg-green-500/10' },
          { label: 'Contribution',      value: group.contributionAmount,  icon: Calendar,   color: 'text-amber-400',    bg: 'bg-amber-500/10' },
          { label: 'Next Payout',       value: group.nextPayout,          icon: Clock,      color: 'text-deepBlue-300', bg: 'bg-deepBlue-500/10' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-dark-500 font-semibold">{stat.label}</p>
                  <p className="text-sm font-bold text-dark-100 mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cycle Progress */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-dark-200">Cycle Progress</p>
            <p className="text-xs text-dark-500 mt-0.5">Month {group.cycleProgress} of 12</p>
          </div>
          <span className="text-sm font-black text-deepBlue-400">{progressPct}%</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-deepBlue-600 to-deepBlue-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-dark-500">Started {group.createdAt}</span>
          <span className="text-xs text-dark-500">{group.frequency} · {group.contributionAmount}/member</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-dark-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-5 py-3.5 text-sm font-semibold transition border-b-2 ${
                activeTab === tab.key
                  ? 'border-deepBlue-500 text-deepBlue-400 bg-deepBlue-500/5'
                  : 'border-transparent text-dark-400 hover:text-dark-200 hover:bg-dark-700/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key ? 'bg-deepBlue-500/20 text-deepBlue-400' : 'bg-dark-700 text-dark-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="divide-y divide-dark-700">
            {group.members.map((member) => {
              const ms = memberStatusConfig[member.status] || memberStatusConfig.paid
              const isExpanded = expandedMember === member.id
              return (
                <div key={member.id}>
                  <div
                    className="flex items-center px-5 py-4 hover:bg-dark-700/40 transition cursor-pointer"
                    onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                  >
                    {/* Position */}
                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-black text-dark-300 flex-shrink-0 mr-4">
                      {member.position}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-deepBlue-700 flex items-center justify-center flex-shrink-0 mr-3 ring-2 ring-deepBlue-600">
                      <span className="text-sm font-bold text-deepBlue-200">
                        {member.name.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-dark-100 truncate">{member.name}</p>
                        {member.isAdmin && (
                          <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        )}
                        {member.payoutReceived && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-dark-500 mt-0.5">{member.phone}</p>
                    </div>

                    {/* Contributed */}
                    <div className="text-right mr-4 hidden sm:block">
                      <p className="text-sm font-bold text-dark-200">{member.contributed}</p>
                      <p className="text-xs text-dark-500">contributed</p>
                    </div>

                    {/* Status */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border mr-3 ${ms.bg} ${ms.text} ${ms.border}`}>
                      {ms.label}
                    </span>

                    {/* Expand */}
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-dark-500 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-dark-500 flex-shrink-0" />
                    }
                  </div>

                  {/* Expanded Actions */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-dark-900/50 border-t border-dark-700/50 flex flex-wrap gap-2 pt-3">
                      <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-deepBlue-500/10 border border-deepBlue-500/20 text-deepBlue-400 hover:bg-deepBlue-500/20 rounded-lg transition text-xs font-semibold">
                        <Send className="w-3 h-3" />
                        <span>Send Reminder</span>
                      </button>
                      <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-700 border border-dark-600 text-dark-300 hover:text-dark-100 hover:bg-dark-600 rounded-lg transition text-xs font-semibold">
                        <Users className="w-3 h-3" />
                        <span>View Profile</span>
                      </button>
                      {member.status === 'missed' && (
                        <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition text-xs font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Flag Member</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Txn ID</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Member</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-dark-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {group.transactions.map((txn) => {
                  const ts = txnStatusConfig[txn.status] || txnStatusConfig.pending
                  return (
                    <tr key={txn.id} className="hover:bg-dark-700/40 transition">
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold text-deepBlue-400">{txn.id}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-dark-200">{txn.user}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold capitalize ${txnTypeColor[txn.type] || 'text-dark-400'}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-dark-100">{txn.amount}</td>
                      <td className="px-5 py-3.5 text-xs text-dark-400">{txn.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${ts.bg} ${ts.text} ${ts.border}`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Rotation Tab */}
        {activeTab === 'rotation' && (
          <div className="p-5 space-y-3">
            <p className="text-xs text-dark-500 mb-4">
              Payout order is determined at group creation. ✓ = payout received · ★ = next in line
            </p>
            {group.members.map((member, idx) => {
              const isNext = !member.payoutReceived && group.members.slice(0, idx).every(m => m.payoutReceived)
              return (
                <div
                  key={member.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl border transition ${
                    isNext
                      ? 'bg-deepBlue-500/10 border-deepBlue-500/30'
                      : member.payoutReceived
                      ? 'bg-dark-900/50 border-dark-700/50 opacity-60'
                      : 'bg-dark-700/30 border-dark-700'
                  }`}
                >
                  {/* Position number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                    isNext ? 'bg-deepBlue-600 text-white' : 'bg-dark-700 text-dark-400'
                  }`}>
                    {member.position}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-deepBlue-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-deepBlue-300">{member.name.charAt(0)}</span>
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-dark-100">{member.name}</p>
                      {isNext && <span className="text-xs bg-deepBlue-500/20 text-deepBlue-400 border border-deepBlue-500/30 px-2 py-0.5 rounded-full font-bold">Next ★</span>}
                    </div>
                    <p className="text-xs text-dark-500 mt-0.5">{member.phone}</p>
                  </div>

                  {/* Payout status */}
                  <div className="text-right">
                    {member.payoutReceived ? (
                      <div className="flex items-center space-x-1.5 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">Received</span>
                      </div>
                    ) : (
                      <span className="text-xs text-dark-500 font-semibold">Pending</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-dark-100">Flag Group Dispute</h2>
            </div>
            <p className="text-sm text-dark-400 mb-4">
              This will mark <span className="text-dark-200 font-semibold">{group.name}</span> as disputed and notify all members that an admin is investigating.
            </p>
            <textarea
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Describe the dispute or reason for investigation..."
              rows={4}
              className="w-full bg-dark-900 border border-dark-600 text-dark-200 placeholder-dark-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDisputeModal(false); setDisputeNote('') }}
                className="flex-1 py-2.5 bg-dark-700 border border-dark-600 text-dark-300 hover:text-dark-100 rounded-lg transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={!disputeNote.trim()}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-dark-950 font-bold rounded-lg transition text-sm"
              >
                Flag Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
