import { Tenant, TenantStats } from '../types/tenant'

export const mockTenants: Tenant[] = [
  {
    id: 1,
    name: '株式会社サンプル',
    subdomain: 'sample-corp',
    contactEmail: 'admin@sample.co.jp',
    contactName: '山田太郎',
    status: 'active',
    plan: 'enterprise',
    maxUsers: 100,
    currentUsers: 45,
    maxStorage: 100,
    usedStorage: 32.5,
    createdAt: '2024-01-15',
    subscriptionEndsAt: '2025-12-31',
    features: {
      customBranding: true,
      apiAccess: true,
      sso: true,
      auditLogs: true,
      advancedReporting: true,
    },
    billing: {
      monthlyFee: 50000,
      currency: 'JPY',
      lastPaymentDate: '2025-10-01',
      nextPaymentDate: '2025-11-01',
    },
  },
  {
    id: 2,
    name: 'ABC株式会社',
    subdomain: 'abc-inc',
    contactEmail: 'info@abc.co.jp',
    contactName: '佐藤花子',
    status: 'active',
    plan: 'pro',
    maxUsers: 50,
    currentUsers: 28,
    maxStorage: 50,
    usedStorage: 15.8,
    createdAt: '2024-03-20',
    subscriptionEndsAt: '2025-12-31',
    features: {
      customBranding: true,
      apiAccess: true,
      sso: false,
      auditLogs: true,
      advancedReporting: false,
    },
    billing: {
      monthlyFee: 20000,
      currency: 'JPY',
      lastPaymentDate: '2025-10-05',
      nextPaymentDate: '2025-11-05',
    },
  },
  {
    id: 3,
    name: 'スタートアップ合同会社',
    subdomain: 'startup-llc',
    contactEmail: 'contact@startup.jp',
    contactName: '鈴木一郎',
    status: 'trial',
    plan: 'pro',
    maxUsers: 50,
    currentUsers: 12,
    maxStorage: 50,
    usedStorage: 3.2,
    createdAt: '2025-10-15',
    trialEndsAt: '2025-11-14',
    features: {
      customBranding: false,
      apiAccess: true,
      sso: false,
      auditLogs: true,
      advancedReporting: false,
    },
    billing: {
      monthlyFee: 0,
      currency: 'JPY',
    },
  },
  {
    id: 4,
    name: 'テスト株式会社',
    subdomain: 'test-company',
    contactEmail: 'test@test.co.jp',
    contactName: '田中美咲',
    status: 'active',
    plan: 'free',
    maxUsers: 10,
    currentUsers: 8,
    maxStorage: 10,
    usedStorage: 5.6,
    createdAt: '2024-06-10',
    features: {
      customBranding: false,
      apiAccess: false,
      sso: false,
      auditLogs: false,
      advancedReporting: false,
    },
    billing: {
      monthlyFee: 0,
      currency: 'JPY',
    },
  },
  {
    id: 5,
    name: 'XYZ Corporation',
    subdomain: 'xyz-corp',
    contactEmail: 'admin@xyz.com',
    contactName: 'John Smith',
    status: 'suspended',
    plan: 'pro',
    maxUsers: 50,
    currentUsers: 35,
    maxStorage: 50,
    usedStorage: 42.1,
    createdAt: '2024-02-28',
    subscriptionEndsAt: '2025-02-28',
    features: {
      customBranding: true,
      apiAccess: true,
      sso: false,
      auditLogs: true,
      advancedReporting: false,
    },
    billing: {
      monthlyFee: 20000,
      currency: 'JPY',
      lastPaymentDate: '2025-08-28',
      nextPaymentDate: '2025-09-28',
    },
  },
  {
    id: 6,
    name: '大手商社株式会社',
    subdomain: 'trading-company',
    contactEmail: 'system@trading.co.jp',
    contactName: '伊藤健太',
    status: 'active',
    plan: 'enterprise',
    maxUsers: 500,
    currentUsers: 378,
    maxStorage: 500,
    usedStorage: 245.7,
    createdAt: '2023-11-01',
    subscriptionEndsAt: '2026-10-31',
    features: {
      customBranding: true,
      apiAccess: true,
      sso: true,
      auditLogs: true,
      advancedReporting: true,
    },
    billing: {
      monthlyFee: 150000,
      currency: 'JPY',
      lastPaymentDate: '2025-10-01',
      nextPaymentDate: '2025-11-01',
    },
  },
]

export const mockTenantStats: TenantStats = {
  totalTenants: 6,
  activeTenants: 4,
  trialTenants: 1,
  suspendedTenants: 1,
  totalRevenue: 2880000, // 240,000 * 12
  mrr: 240000, // Monthly Recurring Revenue
}

export const tenantStatusLabels = {
  active: 'アクティブ',
  suspended: '停止中',
  trial: 'トライアル',
  cancelled: 'キャンセル済み',
}

export const tenantStatusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  trial: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export const planLabels = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

export const planColors = {
  free: 'bg-gray-100 text-gray-800',
  pro: 'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800',
}

export const planPricing = {
  free: { monthlyFee: 0, maxUsers: 10, maxStorage: 10 },
  pro: { monthlyFee: 20000, maxUsers: 50, maxStorage: 50 },
  enterprise: { monthlyFee: 50000, maxUsers: 100, maxStorage: 100 },
}
