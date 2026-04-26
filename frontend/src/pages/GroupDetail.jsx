// frontend/src/pages/GroupDetail.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Copy,
  Share2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle,
  Banknote,
  RefreshCw,
  MessageCircle
} from 'lucide-react'
import groupService from '../services/groupServices'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const GroupDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Transaction history state
  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [txError, setTxError] = useState(null)

  useEffect(() => {
    fetchGroupDetail()
  }, [id])

  const fetchGroupDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await groupService.getGroupById(id)
      setGroup(response.data.group)
    } catch (err) {
      console.error('❌ Failed to fetch group:', err)
      setError(err.message || 'Failed to load group details')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = useCallback(async () => {
    if (!id) return
    try {
      setLoadingTx(true)
      setTxError(null)
      const response = await api.get(`/groups/${id}/transactions`)
      setTransactions(response.data?.transactions || [])
    } catch (err) {
      setTxError(err.message || 'Failed to load transactions')
    } finally {
      setLoadingTx(false)
    }
  }, [id])

  useEffect(() => {
    if (activeTab === 'history') fetchTransactions()
  }, [activeTab, fetchTransactions])

  const copyInvitationCode = () => {
    if (group?.invitationCode) {
      navigator.clipboard.writeText(group.invitationCode)
      alert('Invitation code copied to clipboard!')
    }
  }

  const shareInvitationCode = () => {
    if (group?.invitationCode) {
      const message = `Join my savings group "${group.name}" on AjoSave! Use code: ${group.invitationCode}`
      
      if (navigator.share) {
        navigator.share({
          title: 'Join My Savings Group',
          text: message
        })
      } else {
        navigator.clipboard.writeText(message)
        alert('Invitation message copied to clipboard!')
      }
    }
  }

  const isAdmin = group?.admin._id === user?._id

  const getMemberStatus = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed' },
      current: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Current Turn' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      missed: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Missed' }
    }
    return statusConfig[status] || statusConfig.pending
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading group details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={fetchGroupDetail}
              className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/groups')}
              className="border-2 border-deepBlue-600 text-deepBlue-600 px-6 py-2 rounded-lg hover:bg-deepBlue-50"
            >
              Back to Groups
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!group) {
    return null
  }

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/groups')}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Groups</span>
          </button>
          
          {isAdmin && (
            <button className="flex items-center space-x-2 text-deepBlue-600 hover:text-deepBlue-800">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          )}
        </div>

        {/* Group Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-deepBlue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-deepBlue-800 mb-2">{group.name}</h1>
                {group.description && (
                  <p className="text-deepBlue-600 mb-3">{group.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group.status)}`}>
                    {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {group.credibilityScore}% Credible
                  </span>
                  {isAdmin && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Invitation Code */}
          <div className="bg-gradient-to-r from-deepBlue-500 to-purple-600 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80 mb-1">Invitation Code</p>
                <p className="text-2xl font-bold text-white tracking-wider">{group.invitationCode}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyInvitationCode}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                  title="Copy code"
                >
                  <Copy className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={shareInvitationCode}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                  title="Share code"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-deepBlue-50 rounded-lg">
              <Users className="w-6 h-6 text-deepBlue-600 mx-auto mb-1" />
              <p className="text-xs text-deepBlue-600 mb-1">Members</p>
              <p className="text-lg font-bold text-deepBlue-800">
                {group.members.length}/{group.maxMembers}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-600 mb-1">Contribution</p>
              <p className="text-lg font-bold text-green-800">
                ₦{group.contributionAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-purple-600 mb-1">Total Pool</p>
              <p className="text-lg font-bold text-purple-800">
                ₦{group.totalPool.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-600 mb-1">Frequency</p>
              <p className="text-lg font-bold text-blue-800">
                {group.frequency}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
              activeTab === 'overview'
                ? 'bg-deepBlue-600 text-white'
                : 'text-deepBlue-600 hover:bg-deepBlue-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
              activeTab === 'members'
                ? 'bg-deepBlue-600 text-white'
                : 'text-deepBlue-600 hover:bg-deepBlue-50'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
              activeTab === 'history'
                ? 'bg-deepBlue-600 text-white'
                : 'text-deepBlue-600 hover:bg-deepBlue-50'
            }`}
          >
            History
          </button>
          <button
            onClick={() => navigate(`/groups/${id}/chat`)}
            className="flex-1 py-2 px-4 rounded-md font-medium transition text-deepBlue-600 hover:bg-deepBlue-50 flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Group Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6">
              <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Group Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-deepBlue-100">
                  <span className="text-deepBlue-600">Admin</span>
                  <span className="font-medium text-deepBlue-800">
                    {group.admin.firstName} {group.admin.lastName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-deepBlue-100">
                  <span className="text-deepBlue-600">Start Date</span>
                  <span className="font-medium text-deepBlue-800">
                    {new Date(group.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-deepBlue-100">
                  <span className="text-deepBlue-600">Duration</span>
                  <span className="font-medium text-deepBlue-800">{group.duration} months</span>
                </div>
                <div className="flex justify-between py-2 border-b border-deepBlue-100">
                  <span className="text-deepBlue-600">Payout Order</span>
                  <span className="font-medium text-deepBlue-800 capitalize">{group.payoutOrder}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-deepBlue-100">
                  <span className="text-deepBlue-600">Current Turn</span>
                  <span className="font-medium text-deepBlue-800">
                    {group.currentTurn} of {group.maxMembers}
                  </span>
                </div>
                {group.nextContribution && (
                  <div className="flex justify-between py-2 border-b border-deepBlue-100">
                    <span className="text-deepBlue-600">Next Contribution</span>
                    <span className="font-medium text-deepBlue-800">
                      {new Date(group.nextContribution).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {group.nextPayout && (
                  <div className="flex justify-between py-2">
                    <span className="text-deepBlue-600">Next Payout</span>
                    <span className="font-medium text-deepBlue-800">
                      {new Date(group.nextPayout).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6">
              <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Cycle Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-deepBlue-600 mb-2">
                  <span>Completed Turns</span>
                  <span>{group.currentTurn} of {group.maxMembers}</span>
                </div>
                <div className="w-full bg-deepBlue-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-deepBlue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(group.currentTurn / group.maxMembers) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-deepBlue-600">
                {group.maxMembers - group.currentTurn} turns remaining until cycle completion
              </p>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6">
            <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">
              Members ({group.membersList.length})
            </h2>
            <div className="space-y-3">
              {group.membersList.map((member, index) => {
                const statusConfig = getMemberStatus(member.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <div 
                    key={member.userId}
                    className="flex items-center justify-between p-4 bg-deepBlue-50 rounded-lg hover:bg-deepBlue-100 transition"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-deepBlue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-deepBlue-800">{member.name}</p>
                          {member.role === 'Admin' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-deepBlue-600">
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-deepBlue-600">
                          <span>Turns: {member.turns}</span>
                          <span>•</span>
                          <span>Contributions: {member.contributionsMade}</span>
                          {member.missedContributions > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-red-600">Missed: {member.missedContributions}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex items-center space-x-1`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.text}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-deepBlue-800">Transaction History</h2>
              <button
                onClick={fetchTransactions}
                disabled={loadingTx}
                className="p-2 text-deepBlue-500 hover:text-deepBlue-700 hover:bg-deepBlue-50 rounded-lg transition"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loadingTx ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingTx ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="md" text="Loading transactions..." />
              </div>
            ) : txError ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 mb-3">{txError}</p>
                <button
                  onClick={fetchTransactions}
                  className="text-sm text-deepBlue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-deepBlue-200 mx-auto mb-4" />
                <p className="text-deepBlue-600 font-medium mb-1">No transactions yet</p>
                <p className="text-sm text-deepBlue-400">
                  Contributions and payouts for this group will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-deepBlue-100">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'payout'
                  const typeConfig = {
                    contribution: { icon: ArrowUpCircle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Contribution' },
                    payout: { icon: ArrowDownCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Payout' },
                    withdrawal: { icon: Banknote, color: 'text-red-500', bg: 'bg-red-50', label: 'Withdrawal' },
                  }
                  const cfg = typeConfig[tx.type] || typeConfig.contribution
                  const Icon = cfg.icon
                  const statusColors = {
                    completed: 'bg-green-100 text-green-700',
                    pending: 'bg-yellow-100 text-yellow-700',
                    failed: 'bg-red-100 text-red-700',
                  }

                  return (
                    <div key={tx._id} className="flex items-center gap-4 py-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-deepBlue-800 text-sm">{cfg.label}</p>
                        {tx.description && (
                          <p className="text-xs text-deepBlue-500 truncate">{tx.description}</p>
                        )}
                        <p className="text-xs text-deepBlue-400 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                          {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[tx.status] || 'bg-gray-100 text-gray-600'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetail