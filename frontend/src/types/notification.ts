export type NotificationType =
  | 'approval_request'
  | 'approval_approved'
  | 'approval_rejected'
  | 'approval_comment'
  | 'mention'
  | 'reminder'
  | 'system'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
  relatedUserId?: number
  relatedUserName?: string
  relatedApprovalId?: number
}

export interface NotificationSettings {
  emailNotifications: {
    approvalRequest: boolean
    approvalDecision: boolean
    comments: boolean
    mentions: boolean
    reminders: boolean
    systemAlerts: boolean
  }
  appNotifications: {
    approvalRequest: boolean
    approvalDecision: boolean
    comments: boolean
    mentions: boolean
    reminders: boolean
    systemAlerts: boolean
  }
  reminderSettings: {
    enabled: boolean
    daysBefore: number // 何日前にリマインド
    frequency: 'once' | 'daily' | 'hourly'
  }
}
