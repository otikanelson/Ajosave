// frontend/src/pages/GroupChat.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Info, Smile, Paperclip, MoreVertical, Check, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ─── Mock data (replace with real API / WebSocket) ────────────────────────────

const MOCK_GROUP = {
  _id: '1',
  name: 'Lagos Savers Club',
  members: [{ _id: 'u1' }, { _id: 'u2' }, { _id: 'u3' }],
  status: 'active',
}

const MOCK_MESSAGES = [
  {
    _id: 'm1',
    content: 'Welcome to the group chat! 🎉',
    sender: { _id: 'system', firstName: 'System', lastName: '' },
    senderName: 'System',
    messageType: 'system',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    readBy: [],
    reactions: [],
    isEdited: false,
  },
  {
    _id: 'm2',
    content: 'Hey everyone! Excited to start saving together 💪',
    sender: { _id: 'u2', firstName: 'Amaka', lastName: 'Obi' },
    senderName: 'Amaka Obi',
    messageType: 'text',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    readBy: [{ userId: 'u1', readAt: new Date().toISOString() }],
    reactions: [{ emoji: '🔥', users: ['u1'] }],
    isEdited: false,
  },
  {
    _id: 'm3',
    content: 'When is the first contribution due?',
    sender: { _id: 'u3', firstName: 'Chidi', lastName: 'Nwosu' },
    senderName: 'Chidi Nwosu',
    messageType: 'text',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    readBy: [],
    reactions: [],
    isEdited: false,
  },
  {
    _id: 'm4',
    content: 'First contribution is due next Monday. Make sure your wallet is funded!',
    sender: { _id: 'u1', firstName: 'You', lastName: '' },
    senderName: 'You',
    messageType: 'text',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    readBy: [
      { userId: 'u2', readAt: new Date().toISOString() },
      { userId: 'u3', readAt: new Date().toISOString() },
    ],
    reactions: [{ emoji: '👍', users: ['u2', 'u3'] }],
    isEdited: false,
  },
  {
    _id: 'm5',
    content: 'Amaka Obi made a contribution of ₦25,000',
    sender: { _id: 'system', firstName: 'System', lastName: '' },
    senderName: 'System',
    messageType: 'system',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    readBy: [],
    reactions: [],
    isEdited: false,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDateDivider(iso) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

function shouldShowDateDivider(messages, index) {
  if (index === 0) return true
  return (
    new Date(messages[index].createdAt).toDateString() !==
    new Date(messages[index - 1].createdAt).toDateString()
  )
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-deepBlue-100" />
      <span className="text-xs font-medium text-deepBlue-400 px-2 select-none">{label}</span>
      <div className="flex-1 h-px bg-deepBlue-100" />
    </div>
  )
}

function SystemMessage({ content }) {
  return (
    <div className="flex justify-center my-2">
      <div className="flex items-center gap-1.5 bg-deepBlue-50 border border-deepBlue-100 text-deepBlue-500 text-xs px-3 py-1.5 rounded-full">
        <Info className="w-3 h-3 flex-shrink-0" />
        <span>{content}</span>
      </div>
    </div>
  )
}

function ReactionPill({ emoji, count }) {
  return (
    <button className="flex items-center gap-1 bg-white border border-deepBlue-100 rounded-full px-2 py-0.5 text-xs hover:bg-deepBlue-50 transition">
      <span>{emoji}</span>
      <span className="text-deepBlue-600 font-medium">{count}</span>
    </button>
  )
}

function MessageBubble({ message, isOwn, showAvatar, currentUserId }) {
  const readCount = message.readBy.length

  return (
    <div className={`flex items-end gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar slot */}
      <div className="w-8 flex-shrink-0">
        {!isOwn && showAvatar ? (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(message.senderName)}`}
          >
            {getInitials(message.senderName)}
          </div>
        ) : !isOwn ? (
          <div className="w-8 h-8" />
        ) : null}
      </div>

      {/* Content */}
      <div className={`max-w-[70%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        {!isOwn && showAvatar && (
          <span className={`text-xs font-semibold ml-1 ${getAvatarColor(message.senderName).replace('bg-', 'text-')}`}>
            {message.senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isOwn
              ? 'bg-deepBlue-600 text-white rounded-br-sm'
              : 'bg-white border border-deepBlue-100 text-deepBlue-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

          {/* Meta row */}
          <div className={`flex items-center gap-1 mt-1 justify-end`}>
            {message.isEdited && (
              <span className={`text-[10px] italic ${isOwn ? 'text-white/60' : 'text-deepBlue-400'}`}>
                edited
              </span>
            )}
            <span className={`text-[10px] ${isOwn ? 'text-white/70' : 'text-deepBlue-400'}`}>
              {formatTime(message.createdAt)}
            </span>
            {isOwn && (
              readCount > 0
                ? <CheckCheck className="w-3 h-3 text-blue-300" />
                : <Check className="w-3 h-3 text-white/60" />
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${isOwn ? 'justify-end' : 'justify-start'} px-1`}>
            {message.reactions.map(r => (
              <ReactionPill key={r.emoji} emoji={r.emoji} count={r.users.length} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const GroupChat = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const currentUserId = user?._id || 'u1' // fallback for mock

  const [group] = useState(MOCK_GROUP)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async () => {
    const text = inputText.trim()
    if (!text || isSending) return

    const newMsg = {
      _id: `m_${Date.now()}`,
      content: text,
      sender: { _id: currentUserId, firstName: user?.firstName || 'You', lastName: user?.lastName || '' },
      senderName: user ? `${user.firstName} ${user.lastName}` : 'You',
      messageType: 'text',
      createdAt: new Date().toISOString(),
      readBy: [],
      reactions: [],
      isEdited: false,
    }

    setInputText('')
    setMessages(prev => [...prev, newMsg])
    inputRef.current?.focus()

    // TODO: replace with real API / WebSocket emit
    // setIsSending(true)
    // try { await chatService.sendMessage(id, text) }
    // catch (e) { console.error(e) }
    // finally { setIsSending(false) }
  }, [inputText, isSending, currentUserId, user, id])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-deepBlue-50">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-deepBlue-100 shadow-sm flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-deepBlue-50 text-deepBlue-600 transition"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Group info */}
        <button
          className="flex items-center gap-3 flex-1 min-w-0 text-left hover:bg-deepBlue-50 rounded-lg px-2 py-1 transition"
          onClick={() => navigate(`/groups/${id}`)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deepBlue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {group.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-deepBlue-800 truncate">{group.name}</p>
            <p className="text-xs text-deepBlue-500">{group.members.length} members</p>
          </div>
        </button>

        <button
          onClick={() => navigate(`/groups/${id}`)}
          className="p-2 rounded-lg hover:bg-deepBlue-50 text-deepBlue-500 transition"
          title="View group details"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
        {messages.map((msg, index) => (
          <div key={msg._id}>
            {shouldShowDateDivider(messages, index) && (
              <DateDivider label={formatDateDivider(msg.createdAt)} />
            )}
            {msg.messageType === 'system' ? (
              <SystemMessage content={msg.content} />
            ) : (
              <MessageBubble
                message={msg}
                isOwn={msg.sender._id === currentUserId}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].sender._id !== msg.sender._id ||
                  messages[index - 1].messageType === 'system'
                }
                currentUserId={currentUserId}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ───────────────────────────────────────────────────── */}
      <div className="flex items-end gap-2 px-4 py-3 bg-white border-t border-deepBlue-100 flex-shrink-0">
        <button className="p-2 text-deepBlue-400 hover:text-deepBlue-600 transition flex-shrink-0">
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-end bg-deepBlue-50 border border-deepBlue-200 rounded-2xl px-4 py-2.5 gap-2 focus-within:border-deepBlue-400 transition">
          <textarea
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-deepBlue-800 placeholder-deepBlue-400 resize-none outline-none max-h-32 leading-relaxed"
            placeholder="Type a message…"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ minHeight: '22px' }}
          />
          <button className="p-1 text-deepBlue-400 hover:text-deepBlue-600 transition flex-shrink-0 self-end">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isSending}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition ${
            inputText.trim() && !isSending
              ? 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white shadow-sm'
              : 'bg-deepBlue-200 text-deepBlue-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default GroupChat
