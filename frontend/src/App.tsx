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
import Reports from './components/Reports'
import WebhookSettings from './components/WebhookSettings'
import ReminderSettings from './components/ReminderSettings'
import DelegationSettings from './components/DelegationSettings'
import TenantManagement from './components/SuperAdmin/TenantManagement'
import ApiDocs from './components/ApiDocs'
import LandingPage from './components/LandingPage'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Privacy from './components/Privacy'
import Terms from './components/Terms'
import Login from './components/Login'
import Signup from './components/Signup'
import PaymentSuccess from './components/PaymentSuccess'
import PaymentCancelled from './components/PaymentCancelled'
import BasicAuth from './components/BasicAuth'
import { ImpersonationProvider } from './contexts/ImpersonationContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <NotificationProvider>
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
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings/routes" element={<RouteSettings />} />
                <Route path="/settings/forms" element={<FormTemplates />} />
                <Route path="/settings/webhooks" element={<WebhookSettings />} />
                <Route path="/settings/reminders" element={<ReminderSettings />} />
                <Route path="/settings/delegation" element={<DelegationSettings />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancelled" element={<PaymentCancelled />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ImpersonationProvider>
        </NotificationProvider>
      )}
    </BrowserRouter>
  )
}

function App() {
  return (
    <BasicAuth>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BasicAuth>
  )
}

export default App
