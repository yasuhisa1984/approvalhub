import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import ApprovalDetail from './components/ApprovalDetail'
import ApprovalCreate from './components/ApprovalCreate'
import ApprovalCreateWithTemplate from './components/ApprovalCreateWithTemplate'
import MyApprovals from './components/MyApprovals'
import RouteSettings from './components/RouteSettings'
import FormTemplates from './components/FormTemplates'
import TeamManagement from './components/TeamManagement'
import AdminDashboard from './components/AdminDashboard'
import NotificationCenter from './components/NotificationCenter'
import AuditLogs from './components/AuditLogs'
import TenantManagement from './components/SuperAdmin/TenantManagement'
import ApiDocs from './components/ApiDocs'
import Login from './components/Login'
import Signup from './components/Signup'
import PaymentSuccess from './components/PaymentSuccess'
import PaymentCancelled from './components/PaymentCancelled'
import { ImpersonationProvider } from './contexts/ImpersonationContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <ImpersonationProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/approvals/:id" element={<ApprovalDetail />} />
              <Route path="/approvals/create" element={<ApprovalCreate />} />
              <Route path="/approvals/create-template" element={<ApprovalCreateWithTemplate />} />
              <Route path="/my-approvals" element={<MyApprovals />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/audit" element={<AuditLogs />} />
              <Route path="/superadmin/tenants" element={<TenantManagement />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/settings/routes" element={<RouteSettings />} />
              <Route path="/settings/forms" element={<FormTemplates />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancelled" element={<PaymentCancelled />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ImpersonationProvider>
      )}
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
