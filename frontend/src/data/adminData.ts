import { SystemHealth, ErrorLog, SystemStats, UserActivity, StuckApproval } from '../types/admin'

export const mockSystemHealth: SystemHealth = {
  database: {
    status: 'healthy',
    responseTime: 12,
    connections: 45,
    maxConnections: 100,
  },
  api: {
    status: 'healthy',
    responseTime: 89,
    uptime: 99.98,
  },
  storage: {
    status: 'warning',
    used: 8.5,
    total: 10,
    usagePercent: 85,
  },
}

export const mockErrorLogs: ErrorLog[] = [
  {
    id: 1,
    timestamp: '2025-10-29 13:45:23',
    level: 'error',
    message: 'Database connection timeout',
    stack: 'Error: Connection timeout\n  at Database.connect (db.ts:45)\n  at async handler (api.ts:120)',
    userId: 3,
    userName: '鈴木一郎',
    endpoint: '/api/approvals/create',
    resolved: false,
  },
  {
    id: 2,
    timestamp: '2025-10-29 12:30:15',
    level: 'warning',
    message: 'Slow query detected: 2.5s',
    userId: 2,
    userName: '佐藤花子',
    endpoint: '/api/approvals/list',
    resolved: true,
  },
  {
    id: 3,
    timestamp: '2025-10-29 11:20:45',
    level: 'error',
    message: 'Failed to send email notification',
    stack: 'Error: SMTP connection failed\n  at Mailer.send (mailer.ts:67)',
    endpoint: '/api/notifications/send',
    resolved: false,
  },
  {
    id: 4,
    timestamp: '2025-10-29 10:15:30',
    level: 'warning',
    message: 'API rate limit exceeded',
    userId: 5,
    userName: '伊藤健太',
    endpoint: '/api/approvals/search',
    resolved: true,
  },
  {
    id: 5,
    timestamp: '2025-10-29 09:05:12',
    level: 'info',
    message: 'Large file upload: 15MB',
    userId: 4,
    userName: '田中美咲',
    endpoint: '/api/files/upload',
    resolved: true,
  },
  {
    id: 6,
    timestamp: '2025-10-28 18:50:33',
    level: 'error',
    message: 'Authentication failed: Invalid token',
    endpoint: '/api/auth/verify',
    resolved: false,
  },
]

export const mockSystemStats: SystemStats = {
  totalApprovals: 1248,
  pendingApprovals: 34,
  approvedToday: 12,
  rejectedToday: 2,
  avgApprovalTime: 8.5, // hours
  activeUsers: 156,
  totalUsers: 180,
  stuckApprovals: 5,
}

export const mockUserActivities: UserActivity[] = [
  {
    userId: 1,
    userName: '山田太郎',
    email: 'yamada@example.com',
    approvalCount: 145,
    avgResponseTime: 4.2,
    lastActive: '2025-10-29 13:30:00',
  },
  {
    userId: 2,
    userName: '佐藤花子',
    email: 'sato@example.com',
    approvalCount: 132,
    avgResponseTime: 6.5,
    lastActive: '2025-10-29 12:45:00',
  },
  {
    userId: 5,
    userName: '伊藤健太',
    email: 'ito@example.com',
    approvalCount: 98,
    avgResponseTime: 12.3,
    lastActive: '2025-10-29 11:20:00',
  },
  {
    userId: 3,
    userName: '鈴木一郎',
    email: 'suzuki@example.com',
    approvalCount: 67,
    avgResponseTime: 8.7,
    lastActive: '2025-10-29 10:15:00',
  },
  {
    userId: 4,
    userName: '田中美咲',
    email: 'tanaka@example.com',
    approvalCount: 45,
    avgResponseTime: 15.6,
    lastActive: '2025-10-28 16:30:00',
  },
]

export const mockStuckApprovals: StuckApproval[] = [
  {
    id: 1,
    title: '新規取引先との契約書承認',
    creator: '鈴木一郎',
    currentApprover: '山田太郎',
    daysPending: 7,
    createdAt: '2025-10-22',
  },
  {
    id: 2,
    title: '海外出張経費申請（パリ）',
    creator: '田中美咲',
    currentApprover: '佐藤花子',
    daysPending: 5,
    createdAt: '2025-10-24',
  },
  {
    id: 3,
    title: 'エンジニア採用の最終承認',
    creator: '渡辺由美',
    currentApprover: '伊藤健太',
    daysPending: 4,
    createdAt: '2025-10-25',
  },
  {
    id: 4,
    title: 'オフィス移転の稟議書',
    creator: '小林麻衣',
    currentApprover: '山田太郎',
    daysPending: 8,
    createdAt: '2025-10-21',
  },
  {
    id: 5,
    title: '新システム導入の予算承認',
    creator: '中村誠',
    currentApprover: '佐藤花子',
    daysPending: 3,
    createdAt: '2025-10-26',
  },
]
