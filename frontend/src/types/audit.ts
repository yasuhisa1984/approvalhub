export type AuditAction =
  | 'login'
  | 'logout'
  | 'approval_create'
  | 'approval_approve'
  | 'approval_reject'
  | 'approval_edit'
  | 'approval_delete'
  | 'route_create'
  | 'route_edit'
  | 'route_delete'
  | 'user_invite'
  | 'user_edit'
  | 'user_delete'
  | 'team_edit'
  | 'settings_change'
  | 'form_template_create'
  | 'form_template_edit'
  | 'form_template_delete'

export interface AuditLog {
  id: number
  action: AuditAction
  userId: number
  userName: string
  userEmail: string
  timestamp: string
  ipAddress: string
  userAgent: string
  details: string
  resourceType?: string
  resourceId?: number
  oldValue?: string
  newValue?: string
  success: boolean
}

export interface AuditSummary {
  totalLogs: number
  todayLogs: number
  failedActions: number
  uniqueUsers: number
  topActions: {
    action: AuditAction
    count: number
  }[]
}
