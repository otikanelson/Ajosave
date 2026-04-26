import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../../pages/AdminDashboard'
import UserManagement from '../../pages/UserManagement'
import GroupManagement from '../../pages/GroupManagement'
import GroupDetail from '../../pages/GroupDetail'
import TransactionMonitoring from '../../pages/TransactionMonitoring'
import SupportTickets from '../../pages/SupportTickets'
import Analytics from '../../pages/Analytics'
import AuditLogs from '../../pages/AuditLogs'
import Settings from '../../pages/Settings'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-6 bg-dark-900">
          <Routes>
            <Route path="/dashboard"        element={<AdminDashboard />} />
            <Route path="/users"            element={<UserManagement />} />
            <Route path="/groups"           element={<GroupManagement />} />
            <Route path="/groups/:id"       element={<GroupDetail />} />
            <Route path="/transactions"     element={<TransactionMonitoring />} />
            <Route path="/support"          element={<SupportTickets />} />
            <Route path="/analytics"        element={<Analytics />} />
            <Route path="/audit-logs"       element={<AuditLogs />} />
            <Route path="/settings"         element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
