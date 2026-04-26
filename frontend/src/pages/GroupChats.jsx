// frontend/src/pages/GroupChats.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Search, Users, ChevronRight, Plus } from 'lucide-react'
import groupService from '../services/groupServices'
import LoadingSpinner from '../components/common/LoadingSpinner'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
]

function getAvatarGradient(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

function getStatusConfig(status) {
  switch (status) {
    case 'active':
      return { dot: 'bg-green-500', label: 'Active', badge: 'bg-green-100 text-green-700' }
    case 'pending':
      return { dot: 'bg-amber-400', label: 'Pending', badge: 'bg-amber-100 text-amber-700' }
    case 'completed':
      return { dot: 'bg-blue-500', label: 'Completed', badge: 'bg-blue-100 text-blue-700' }
    default:
      return { dot: 'bg-gray-400', label: status, badge: 'bg-gray-100 text-gray-600' }
  }
}

// Placeholder preview — will be replaced with real last-message data from API
function getPreview(group) {
  const previews = {
    active: 'Group is active — click to chat',
    pending: 'Waiting for members to join…',
    completed: 'This group has completed its cycle',
    cancelled: 'This group was cancelled',
  }
  return previews[group.status] ?? 'No messages yet'
}

// ─── Group Chat Row ───────────────────────────────────────────────────────────

function GroupChatRow({ group, onClick }) {
  const status = getStatusConfig(group.status)
  const preview = getPreview(group)

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-deepBlue-50 transition-colors text-left group"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(group.name)} flex items-center justify-center`}
        >
          <span className="text-white font-bold text-sm">{getInitials(group.name)}</span>
        </div>
        {/* Status dot */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${status.dot}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-semibold text-deepBlue-800 truncate">{group.name}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${status.badge}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-deepBlue-500 truncate">{preview}</span>
          <div className="flex items-center gap-1 flex-shrink-0 text-deepBlue-400">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{group.members?.length ?? 0}/{group.maxMembers}</span>
          </div>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-deepBlue-300 flex-shrink-0 group-hover:text-deepBlue-500 transition-colors" />
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const GroupChats = () => {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await groupService.getUserGroups()
      setGroups(response.data.groups || [])
    } catch (err) {
      setError('Failed to load groups. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  // Sort: active first, then pending, then others
  const sorted = [...filtered].sort((a, b) => {
    const order = { active: 0, pending: 1, completed: 2, cancelled: 3 }
    return (order[a.status] ?? 9) - (order[b.status] ?? 9)
  })

  return (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto max-w-2xl px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-deepBlue-800">Group Chats</h1>
            <p className="text-sm text-deepBlue-500 mt-0.5">
              {groups.length} group{groups.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/groups/create')}
            className="flex items-center gap-2 bg-deepBlue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-deepBlue-700 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            New Group
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deepBlue-400" />
          <input
            type="text"
            placeholder="Search groups…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-deepBlue-200 rounded-xl text-sm text-deepBlue-800 placeholder-deepBlue-400 focus:outline-none focus:border-deepBlue-400 transition"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text="Loading chats…" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchGroups}
              className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg hover:bg-deepBlue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-deepBlue-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-deepBlue-400" />
            </div>
            <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">
              {search ? 'No groups match your search' : 'No group chats yet'}
            </h3>
            <p className="text-deepBlue-500 text-sm mb-6 max-w-xs">
              {search
                ? 'Try a different name'
                : 'Create or join a savings group to start chatting with your members'}
            </p>
            {!search && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/groups/create')}
                  className="bg-deepBlue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-deepBlue-700 transition text-sm"
                >
                  Create Group
                </button>
                <button
                  onClick={() => navigate('/groups/join')}
                  className="border-2 border-deepBlue-600 text-deepBlue-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-deepBlue-50 transition text-sm"
                >
                  Join Group
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-deepBlue-100 shadow-sm overflow-hidden divide-y divide-deepBlue-50">
            {sorted.map(group => (
              <GroupChatRow
                key={group._id}
                group={group}
                onClick={() => navigate(`/groups/${group._id}/chat`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupChats
