import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, Wallet as WalletIcon, ArrowUp, ArrowDown, Download,
  Shield, CreditCard, CheckCircle, Clock, AlertCircle, Lock, Unlock,
  RefreshCw, Plus, Star
} from 'lucide-react'
import walletService from '../services/walletServices'
import { api } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import BankAccountModal from '../components/Wallet/BankAccountModal'

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''

const FILTERS = ['all', 'contribution', 'payout', 'withdrawal']

export default function Wallet() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // ── Data state ──────────────────────────────────────────────────────────────
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [locks, setLocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeFilter, setActiveFilter] = useState('all')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showAutoWithdrawalModal, setShowAutoWithdrawalModal] = useState(false)
  const [showFundModal, setShowFundModal] = useState(false)
  const [showLockModal, setShowLockModal] = useState(false)
  const [showAddBankModal, setShowAddBankModal] = useState(false)

  // ── Form state ──────────────────────────────────────────────────────────────
  const [withdrawForm, setWithdrawForm] = useState({ bankAccountId: '', amount: '' })
  const [withdrawError, setWithdrawError] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  const [autoWithdrawalSettings, setAutoWithdrawalSettings] = useState({
    enabled: false, bankAccount: '', percentage: 100, minAmount: 1000
  })
  const [savingAutoWithdrawal, setSavingAutoWithdrawal] = useState(false)
  const [autoWithdrawalError, setAutoWithdrawalError] = useState(null)

  const [fundAmount, setFundAmount] = useState('')
  const [funding, setFunding] = useState(false)
  const [fundError, setFundError] = useState(null)

  const [lockForm, setLockForm] = useState({ amount: '', label: '', releaseType: 'manual', releaseDate: '' })
  const [lockError, setLockError] = useState(null)
  const [locking, setLocking] = useState(false)
  const [unlockingId, setUnlockingId] = useState(null)

  // ── Data fetching ───────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [walletRes, txRes, bankRes, locksRes] = await Promise.all([
        walletService.getMyWallet(),
        walletService.getWalletTransactions(),
        walletService.getBankAccounts(),
        walletService.getLocks()
      ])
      setWalletData(walletRes.data.wallet)
      setTransactions(txRes.data.transactions || [])
      setBankAccounts(bankRes.data.bankAccounts || [])
      setLocks(locksRes.data.locks || [])
      // Pre-populate auto-withdrawal form
      if (walletRes.data.wallet?.autoWithdrawal) {
        setAutoWithdrawalSettings(walletRes.data.wallet.autoWithdrawal)
      }
    } catch (err) {
      setError(err.message || 'Failed to load wallet data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Filtered transactions ───────────────────────────────────────────────────
  const filteredTx = transactions.filter(
    t => activeFilter === 'all' || t.type === activeFilter
  )

  // ── Withdraw ────────────────────────────────────────────────────────────────
  const handleWithdraw = async () => {
    setWithdrawError(null)
    const amount = parseFloat(withdrawForm.amount)
    if (!withdrawForm.bankAccountId) { setWithdrawError('Select a bank account'); return }
    if (!amount || amount <= 0) { setWithdrawError('Enter a valid amount'); return }
    if (walletData && amount > walletData.availableBalance) {
      setWithdrawError(`Amount exceeds available balance (₦${walletData.availableBalance.toLocaleString()})`)
      return
    }
    try {
      setWithdrawing(true)
      await walletService.withdraw(withdrawForm.bankAccountId, amount)
      setShowWithdrawModal(false)
      setWithdrawForm({ bankAccountId: '', amount: '' })
      await loadAll()
    } catch (err) {
      setWithdrawError(err.message || 'Withdrawal failed')
    } finally {
      setWithdrawing(false)
    }
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const response = await api.getBlob('/transactions/export')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const dateStr = new Date().toISOString().split('T')[0]
      const name = user ? `${user.firstName}_${user.lastName}` : 'user'
      a.href = url
      a.download = `transactions_${name}_${dateStr}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert(err.message || 'Export failed')
    }
  }

  // ── Auto-withdrawal ─────────────────────────────────────────────────────────
  const handleSaveAutoWithdrawal = async () => {
    setAutoWithdrawalError(null)
    try {
      setSavingAutoWithdrawal(true)
      await walletService.saveAutoWithdrawal(autoWithdrawalSettings)
      setShowAutoWithdrawalModal(false)
      await loadAll()
    } catch (err) {
      setAutoWithdrawalError(err.message || 'Failed to save settings')
    } finally {
      setSavingAutoWithdrawal(false)
    }
  }

  // ── Fund wallet ─────────────────────────────────────────────────────────────
  const handleFundWallet = () => {
    const amount = parseFloat(fundAmount)
    if (!amount || amount < 100) { setFundError('Minimum amount is ₦100'); return }
    if (!user?.email) { setFundError('User email not found'); return }
    setFundError(null)
    setShowFundModal(false)
    setFunding(true)
    const ref = `FUND-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: user.email,
      amount: Math.round(amount * 100),
      currency: 'NGN',
      ref,
      onClose: () => { setFunding(false) },
      callback: async (response) => {
        try {
          await walletService.verifyFunding(response.reference || ref)
          await loadAll()
          setFundAmount('')
        } catch (err) {
          alert(err.message || 'Verification failed. Reference: ' + (response.reference || ref))
        } finally {
          setFunding(false)
        }
      }
    })
    handler.openIframe()
  }

  // ── Lock funds ──────────────────────────────────────────────────────────────
  const handleCreateLock = async () => {
    setLockError(null)
    const amount = parseFloat(lockForm.amount)
    if (!amount || amount <= 0) { setLockError('Enter a valid amount'); return }
    if (lockForm.releaseType === 'date' && !lockForm.releaseDate) {
      setLockError('Select a release date'); return
    }
    try {
      setLocking(true)
      await walletService.createLock(amount, lockForm.label, lockForm.releaseType, lockForm.releaseDate || undefined)
      setShowLockModal(false)
      setLockForm({ amount: '', label: '', releaseType: 'manual', releaseDate: '' })
      await loadAll()
    } catch (err) {
      setLockError(err.message || 'Failed to lock funds')
    } finally {
      setLocking(false)
    }
  }

  const handleUnlock = async (lockId) => {
    try {
      setUnlockingId(lockId)
      await walletService.unlock(lockId)
      await loadAll()
    } catch (err) {
      alert(err.message || 'Failed to unlock')
    } finally {
      setUnlockingId(null)
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />
    return <AlertCircle className="w-4 h-4 text-red-500" />
  }

  const txColor = (type) => {
    if (type === 'payout' || type === 'fund_wallet' || type === 'unlock') return 'text-green-600'
    return 'text-red-600'
  }

  const txSign = (type) => (type === 'payout' || type === 'fund_wallet' || type === 'unlock') ? '+' : '-'

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading wallet..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadAll} className="flex items-center gap-2 mx-auto bg-deepBlue-600 text-white px-6 py-2 rounded-lg">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlue-50">
      <BankAccountModal
        isOpen={showAddBankModal}
        onClose={() => setShowAddBankModal(false)}
        onSuccess={() => { setShowAddBankModal(false); loadAll() }}
      />

      {/* ── Withdraw Modal ─────────────────────────────────────────────────── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-deepBlue-100">
              <h2 className="text-xl font-bold text-deepBlue-800">Withdraw Funds</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-deepBlue-400 hover:text-deepBlue-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {withdrawError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{withdrawError}</p>}
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Bank Account</label>
                <select
                  value={withdrawForm.bankAccountId}
                  onChange={e => setWithdrawForm(p => ({ ...p, bankAccountId: e.target.value }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                >
                  <option value="">Select account</option>
                  {bankAccounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.bankName} — ****{acc.accountNumber.slice(-4)} {acc.isPrimary ? '(Primary)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Amount (₦)</label>
                <input
                  type="number" min="1"
                  value={withdrawForm.amount}
                  onChange={e => setWithdrawForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  placeholder="Enter amount"
                />
                {walletData && <p className="text-xs text-deepBlue-500 mt-1">Available: ₦{walletData.availableBalance.toLocaleString()}</p>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowWithdrawModal(false)} className="flex-1 border border-deepBlue-200 text-deepBlue-600 py-3 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleWithdraw} disabled={withdrawing} className="flex-1 bg-deepBlue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                  {withdrawing ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Fund Wallet Modal ──────────────────────────────────────────────── */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-deepBlue-100">
              <h2 className="text-xl font-bold text-deepBlue-800">Fund Wallet</h2>
              <button onClick={() => setShowFundModal(false)} className="text-deepBlue-400 hover:text-deepBlue-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {fundError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{fundError}</p>}
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Amount (₦)</label>
                <input
                  type="number" min="100"
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  placeholder="Minimum ₦100"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1000, 2000, 5000, 10000].map(amt => (
                  <button key={amt} onClick={() => setFundAmount(String(amt))}
                    className="px-4 py-2 rounded-full bg-deepBlue-50 border border-deepBlue-200 text-deepBlue-700 text-sm font-medium hover:bg-deepBlue-100">
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowFundModal(false)} className="flex-1 border border-deepBlue-200 text-deepBlue-600 py-3 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleFundWallet} disabled={!fundAmount || parseFloat(fundAmount) < 100}
                  className="flex-1 bg-deepBlue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Auto-Withdrawal Modal ──────────────────────────────────────────── */}
      {showAutoWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-deepBlue-100">
              <h2 className="text-xl font-bold text-deepBlue-800">Auto-Withdrawal Setup</h2>
              <button onClick={() => setShowAutoWithdrawalModal(false)} className="text-deepBlue-400 hover:text-deepBlue-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {autoWithdrawalError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{autoWithdrawalError}</p>}
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Bank Account</label>
                <select
                  value={autoWithdrawalSettings.bankAccount}
                  onChange={e => setAutoWithdrawalSettings(p => ({ ...p, bankAccount: e.target.value }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                >
                  <option value="">Select account</option>
                  {bankAccounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.bankName} — ****{acc.accountNumber.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">
                  Withdrawal Percentage: {autoWithdrawalSettings.percentage}%
                </label>
                <input type="range" min="10" max="100" step="10"
                  value={autoWithdrawalSettings.percentage}
                  onChange={e => setAutoWithdrawalSettings(p => ({ ...p, percentage: parseInt(e.target.value) }))}
                  className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Minimum Amount (₦)</label>
                <input type="number" min="100"
                  value={autoWithdrawalSettings.minAmount}
                  onChange={e => setAutoWithdrawalSettings(p => ({ ...p, minAmount: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={autoWithdrawalSettings.enabled}
                  onChange={e => setAutoWithdrawalSettings(p => ({ ...p, enabled: e.target.checked }))}
                  className="w-4 h-4 text-deepBlue-600" />
                <span className="text-sm text-deepBlue-700">Enable Auto-Withdrawal</span>
              </label>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAutoWithdrawalModal(false)} className="flex-1 border border-deepBlue-200 text-deepBlue-600 py-3 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleSaveAutoWithdrawal} disabled={savingAutoWithdrawal}
                  className="flex-1 bg-deepBlue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                  {savingAutoWithdrawal ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lock Funds Modal ───────────────────────────────────────────────── */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-deepBlue-100">
              <h2 className="text-xl font-bold text-deepBlue-800">Lock Funds</h2>
              <button onClick={() => setShowLockModal(false)} className="text-deepBlue-400 hover:text-deepBlue-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {lockError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{lockError}</p>}
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Amount (₦)</label>
                <input type="number" min="1"
                  value={lockForm.amount}
                  onChange={e => setLockForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  placeholder="Amount to lock" />
                {walletData && <p className="text-xs text-deepBlue-500 mt-1">Available: ₦{walletData.availableBalance.toLocaleString()}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Label (optional)</label>
                <input type="text" maxLength={100}
                  value={lockForm.label}
                  onChange={e => setLockForm(p => ({ ...p, label: e.target.value }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                  placeholder="e.g. Emergency fund" />
              </div>
              <div>
                <label className="block text-sm font-medium text-deepBlue-700 mb-2">Release Condition</label>
                <select value={lockForm.releaseType}
                  onChange={e => setLockForm(p => ({ ...p, releaseType: e.target.value }))}
                  className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500">
                  <option value="manual">Manual unlock</option>
                  <option value="date">Specific date</option>
                </select>
              </div>
              {lockForm.releaseType === 'date' && (
                <div>
                  <label className="block text-sm font-medium text-deepBlue-700 mb-2">Release Date</label>
                  <input type="date"
                    value={lockForm.releaseDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setLockForm(p => ({ ...p, releaseDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500" />
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowLockModal(false)} className="flex-1 border border-deepBlue-200 text-deepBlue-600 py-3 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleCreateLock} disabled={locking}
                  className="flex-1 bg-deepBlue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                  {locking ? 'Locking...' : 'Lock Funds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-deepBlue-600">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">My Wallet</h1>
          <button onClick={loadAll} className="text-deepBlue-600 hover:text-deepBlue-800">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl p-6 text-white mb-6" style={{ backgroundColor: '#0a79f0' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <WalletIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100">Total Balance</p>
              <h2 className="text-3xl font-bold">₦{(walletData?.totalBalance ?? 0).toLocaleString()}</h2>
            </div>
          </div>
          <div className="border-t border-blue-400 border-opacity-40 pt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-blue-200">Available</span><span className="font-semibold">₦{(walletData?.availableBalance ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-blue-200">Locked</span><span className="font-semibold">₦{(walletData?.lockedBalance ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-blue-200">Contributed</span><span className="font-semibold">₦{(walletData?.totalContributions ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-blue-200">Received</span><span className="font-semibold">₦{(walletData?.totalPayouts ?? 0).toLocaleString()}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setShowFundModal(true)} disabled={funding}
              className="bg-white text-deepBlue-600 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-deepBlue-50 disabled:opacity-60">
              <Plus className="w-4 h-4" /> {funding ? 'Processing...' : 'Fund Wallet'}
            </button>
            <button onClick={() => setShowWithdrawModal(true)}
              className="bg-white bg-opacity-20 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-30">
              <ArrowUp className="w-4 h-4" /> Withdraw
            </button>
            <button onClick={handleExport}
              className="bg-white bg-opacity-20 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-30">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setShowLockModal(true)}
              className="bg-white bg-opacity-20 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-30">
              <Lock className="w-4 h-4" /> Lock Funds
            </button>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-4">
            <h2 className="text-lg font-semibold text-deepBlue-800">Bank Accounts</h2>
            <button onClick={() => setShowAddBankModal(true)} className="text-deepBlue-600 text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {bankAccounts.length === 0 ? (
            <button onClick={() => setShowAddBankModal(true)}
              className="mx-4 w-[calc(100%-2rem)] border-2 border-dashed border-deepBlue-200 rounded-xl p-4 text-deepBlue-500 flex items-center justify-center gap-2 hover:border-deepBlue-400">
              <Plus className="w-5 h-5" /> Add a bank account
            </button>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 px-4">
              {bankAccounts.map(acc => (
                <div key={acc._id} className="min-w-[180px] rounded-xl p-4 text-white relative flex-shrink-0" style={{ backgroundColor: '#0a79f0' }}>
                  {acc.isPrimary && (
                    <span className="absolute top-2 right-2 bg-white bg-opacity-30 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Primary
                    </span>
                  )}
                  <p className="text-xs text-blue-200 mb-1">{acc.bankName}</p>
                  <p className="text-base font-bold tracking-widest mb-1">****{acc.accountNumber.slice(-4)}</p>
                  <p className="text-xs text-blue-100">{acc.accountName}</p>
                  {!acc.isPrimary && (
                    <button
                      onClick={async () => {
                        try { await walletService.setPrimaryBankAccount(acc._id); await loadAll() }
                        catch (err) { alert(err.message || 'Failed') }
                      }}
                      className="mt-2 text-xs text-white underline opacity-80 hover:opacity-100">
                      Set as Primary
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Locks */}
        {locks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Locked Funds</h2>
            <div className="space-y-3">
              {locks.map(lock => (
                <div key={lock._id} className="flex items-center justify-between p-3 bg-deepBlue-50 rounded-xl border border-deepBlue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-deepBlue-100 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-deepBlue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-deepBlue-800">{lock.label || 'Locked Funds'}</p>
                      <p className="text-sm text-deepBlue-600">
                        {lock.releaseType === 'date'
                          ? `Releases ${new Date(lock.releaseDate).toLocaleDateString()}`
                          : 'Manual release'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-deepBlue-800">₦{lock.amount.toLocaleString()}</p>
                    {lock.releaseType === 'manual' && (
                      <button
                        onClick={() => handleUnlock(lock._id)}
                        disabled={unlockingId === lock._id}
                        className="text-xs text-deepBlue-600 underline mt-1 flex items-center gap-1 disabled:opacity-50">
                        <Unlock className="w-3 h-3" />
                        {unlockingId === lock._id ? 'Unlocking...' : 'Unlock'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? 'bg-deepBlue-600 text-white'
                  : 'bg-white text-deepBlue-600 border border-deepBlue-200 hover:bg-deepBlue-50'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 mb-6">
          <div className="p-4 border-b border-deepBlue-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-deepBlue-800">Transactions</h2>
            <span className="text-sm text-deepBlue-500">{filteredTx.length} records</span>
          </div>
          {filteredTx.length === 0 ? (
            <div className="p-8 text-center text-deepBlue-400">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-deepBlue-100">
              {filteredTx.map(tx => (
                <div key={tx._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txSign(tx.type) === '+' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {txSign(tx.type) === '+' ? <ArrowDown className="w-4 h-4 text-green-600" /> : <ArrowUp className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-deepBlue-800 capitalize">{tx.type.replace('_', ' ')}</span>
                        {getStatusIcon(tx.status)}
                      </div>
                      {tx.description && <p className="text-sm text-deepBlue-600">{tx.description}</p>}
                      <p className="text-xs text-deepBlue-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${txColor(tx.type)}`}>
                    {txSign(tx.type)}₦{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auto-Withdrawal Setup */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-deepBlue-800">Auto-Withdrawal</h3>
              <p className="text-sm text-deepBlue-600">Automatically withdraw payouts to your bank account</p>
            </div>
          </div>
          {autoWithdrawalSettings.enabled && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">Active</p>
                <p className="text-sm text-green-700">{autoWithdrawalSettings.percentage}% of payouts</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
          <button onClick={() => setShowAutoWithdrawalModal(true)}
            className="w-full bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700">
            {autoWithdrawalSettings.enabled ? 'Update Settings' : 'Setup Auto-Withdrawal'}
          </button>
        </div>
      </div>
    </div>
  )
}
