import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users, Calendar, Plus, CreditCard,
  Wallet, Building2, List, MessageCircle, LogIn,
  ArrowDown, ArrowUp, Bell, EyeOff, Eye,
} from 'lucide-react'
import groupService from '../services/groupServices'
import walletService from '../services/walletServices'
import LoadingSpinner from '../components/common/LoadingSpinner'

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)
  const [wallet, setWallet] = useState(null)
  const [groups, setGroups] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated && user) fetchDashboardData()
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true); setError(null)
      const [walletRes, groupsRes, txRes] = await Promise.all([
        walletService.getMyWallet(),
        groupService.getUserGroups(),
        walletService.getWalletTransactions({ limit: 5 })
      ])
      setWallet(walletRes.data.wallet)
      setGroups(groupsRes.data.groups || [])
      setRecentTransactions(txRes.data.transactions?.slice(0, 5) || [])
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth')
  }, [isAuthenticated, authLoading, navigate])


  const activeGroups = groups.filter(g => g.status === 'active')
  const pendingGroups = groups.filter(g => g.status === 'pending')
  const nextPayout = activeGroups.filter(g => g.nextPayout)
    .sort((a, b) => new Date(a.nextPayout) - new Date(b.nextPayout))[0]
  const upcomingContributions = activeGroups.filter(g => g.nextContribution)
    .sort((a, b) => new Date(a.nextContribution) - new Date(b.nextContribution)).slice(0, 3)

  const getStatusColor = (s) => {
    switch (s) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const quickActions = [
    { icon: Plus, label: 'Create Group', onClick: () => navigate('/groups/create') },
    { icon: LogIn, label: 'Join Group', onClick: () => navigate('/groups/join') },
    { icon: CreditCard, label: 'Make Payment', onClick: () => navigate('/payment') },
    { icon: Wallet, label: 'Wallet', onClick: () => navigate('/wallet') },
    { icon: Building2, label: 'Add Bank', onClick: () => navigate('/wallet') },
    { icon: Users, label: 'My Groups', onClick: () => navigate('/groups') },
    { icon: List, label: 'Transactions', onClick: () => navigate('/wallet') },
    { icon: MessageCircle, label: 'Group Chat', onClick: () => navigate('/chats') },
  ]

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-24">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-10 max-w-6xl">
        {/* Greeting */}
        <div className="mb-4">
          <p className="text-deepBlue-500 text-xs">{getGreeting()},</p>
          <p className="text-lg font-bold text-deepBlue-800">{user?.firstName} 👋</p>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl p-4 sm:p-5 text-white mb-4 shadow-lg" style={{ backgroundColor: '#0a79f0' }}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="text-blue-200 text-xs mb-1">Total Balance</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {showBalance ? `₦${wallet?.totalBalance?.toLocaleString() || '0.00'}` : '₦ *****'}
                </h2>
                <button onClick={() => setShowBalance(!showBalance)} className="text-blue-200 hover:text-white transition">
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs mb-1">Active Groups</p>
              <p className="text-2xl sm:text-3xl font-bold">{activeGroups.length}</p>
              {pendingGroups.length > 0 && (
                <p className="text-blue-300 text-xs mt-1">{pendingGroups.length} pending</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm border-t border-blue-400 border-opacity-40 pt-3">
            {[
              { label: 'Locked', key: 'lockedBalance' },
              { label: 'Contributed', key: 'totalContributions' },
              { label: 'Received', key: 'totalPayouts' },
            ].map(({ label, key }) => (
              <div key={key}>
                <p className="text-blue-200 text-xs">{label}</p>
                <p className="font-semibold text-sm">
                  {showBalance ? `₦${wallet?.[key]?.toLocaleString() || '0.00'}` : '****'}
                </p>
              </div>
            ))}
          </div>

          {nextPayout && (
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-blue-400 border-opacity-40">
              <div>
                <p className="text-blue-200 text-xs">Next Payout</p>
                <p className="font-semibold text-sm">{new Date(nextPayout.nextPayout).toLocaleDateString()}</p>
                <p className="text-blue-300 text-xs">{nextPayout.name}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs">Amount</p>
                <p className="font-semibold text-sm">₦{(nextPayout.contributionAmount * nextPayout.maxMembers).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-deepBlue-800 mb-2">Quick Actions</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {quickActions.map(({ icon: Icon, label, onClick }) => (
              <button key={label} onClick={onClick}
                className="bg-white rounded-xl p-2 shadow-sm border border-deepBlue-100 hover:shadow-md transition flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0a79f015' }}>
                  <Icon className="w-4 h-4" style={{ color: '#0a79f0' }} />
                </div>
                <span className="text-xs font-medium text-deepBlue-700 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main content — stacks on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My Groups */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-deepBlue-800">My Groups</h3>
              <button onClick={() => navigate('/groups')} className="text-xs font-medium" style={{ color: '#0a79f0' }}>View All</button>
            </div>
            {groups.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-deepBlue-100">
                <Users className="w-10 h-10 text-deepBlue-300 mx-auto mb-2" />
                <p className="text-deepBlue-600 mb-3 text-sm">No groups yet</p>
                <div className="flex justify-center space-x-2">
                  <button onClick={() => navigate('/groups/create')} className="text-white text-xs px-4 py-1.5 rounded-lg" style={{ backgroundColor: '#0a79f0' }}>Create</button>
                  <button onClick={() => navigate('/groups/join')} className="text-xs px-4 py-1.5 rounded-lg border" style={{ borderColor: '#0a79f0', color: '#0a79f0' }}>Join</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {groups.slice(0, 3).map((group) => (
                  <div key={group._id} onClick={() => navigate(`/groups/${group._id}`)}
                    className="bg-white rounded-xl p-3 shadow-sm border border-deepBlue-100 hover:shadow-md transition cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0a79f015' }}>
                        <Users className="w-4 h-4" style={{ color: '#0a79f0' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-deepBlue-800 truncate text-sm">{group.name}</h4>
                        <p className="text-xs text-deepBlue-500">
                          {group.members.length}/{group.maxMembers} members · ₦{group.contributionAmount.toLocaleString()}/{group.frequency}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(group.status)}`}>
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </span>
                    </div>
                    {group.nextContribution && group.status === 'active' && (
                      <div className="flex items-center space-x-1 text-xs text-deepBlue-500 mt-2 pt-2 border-t border-deepBlue-50">
                        <Calendar className="w-3 h-3" />
                        <span>Next: {new Date(group.nextContribution).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-deepBlue-800">Recent Transactions</h3>
              <button onClick={() => navigate('/wallet')} className="text-xs font-medium" style={{ color: '#0a79f0' }}>View All</button>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-deepBlue-100">
                <List className="w-10 h-10 text-deepBlue-300 mx-auto mb-2" />
                <p className="text-deepBlue-500 text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <div key={tx._id} className="bg-white rounded-xl p-3 border border-deepBlue-100 flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === 'payout' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'payout'
                        ? <ArrowDown className="w-4 h-4 text-green-600" />
                        : <ArrowUp className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-deepBlue-800 text-sm capitalize">{tx.type}</p>
                      <p className="text-xs text-deepBlue-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-bold text-sm flex-shrink-0 ${tx.type === 'payout' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'payout' ? '+' : '-'}₦{tx.amount?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Contributions Alert */}
        {upcomingContributions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mt-4">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1 text-sm">Upcoming Contributions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {upcomingContributions.map((group) => (
                    <div key={group._id} className="flex justify-between items-center text-xs">
                      <span className="text-blue-700">{group.name}</span>
                      <span className="font-medium text-blue-800">
                        ₦{group.contributionAmount.toLocaleString()} · {new Date(group.nextContribution).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/payment')} className="mt-1 text-xs font-medium text-blue-800 underline">
                  Make Payment →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
