export interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'error'
    responseTime: number
    connections: number
    maxConnections: number
  }
  api: {
    status: 'healthy' | 'warning' | 'error'
    responseTime: number
    uptime: number
  }
  storage: {
    status: 'healthy' | 'warning' | 'error'
    used: number
    total: number
    usagePercent: number
  }
}

export interface ErrorLog {
  id: number
  timestamp: string
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  userId?: number
  userName?: string
  endpoint?: string
  resolved: boolean
}

export interface SystemStats {
  totalApprovals: number
  pendingApprovals: number
  approvedToday: number
  rejectedToday: number
  avgApprovalTime: number
  activeUsers: number
  totalUsers: number
  stuckApprovals: number // 3日以上滞留
}

export interface UserActivity {
  userId: number
  userName: string
  email: string
  approvalCount: number
  avgResponseTime: number
  lastActive: string
}

export interface StuckApproval {
  id: number
  title: string
  creator: string
  currentApprover: string
  daysPending: number
  createdAt: string
}
