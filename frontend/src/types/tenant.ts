export type TenantStatus = 'active' | 'suspended' | 'trial' | 'cancelled'

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'

export interface Tenant {
  id: number
  name: string
  subdomain: string
  contactEmail: string
  contactName: string
  status: TenantStatus
  plan: SubscriptionPlan
  maxUsers: number
  currentUsers: number
  maxStorage: number // GB
  usedStorage: number // GB
  createdAt: string
  trialEndsAt?: string
  subscriptionEndsAt?: string
  features: {
    customBranding: boolean
    apiAccess: boolean
    sso: boolean
    auditLogs: boolean
    advancedReporting: boolean
  }
  billing: {
    monthlyFee: number
    currency: string
    lastPaymentDate?: string
    nextPaymentDate?: string
  }
}

export interface TenantCreate {
  name: string
  subdomain: string
  contactEmail: string
  contactName: string
  plan: SubscriptionPlan
}

export interface TenantStats {
  totalTenants: number
  activeTenants: number
  trialTenants: number
  suspendedTenants: number
  totalRevenue: number
  mrr: number // Monthly Recurring Revenue
}
