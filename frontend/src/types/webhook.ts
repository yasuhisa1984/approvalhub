export type WebhookEventType =
  | 'approval_request_created'
  | 'approval_request_approved'
  | 'approval_request_rejected'
  | 'approval_request_commented'
  | 'approval_request_completed'
  | 'approval_request_cancelled'

export interface Webhook {
  id: number
  name: string
  url: string
  events: WebhookEventType[]
  isActive: boolean
  createdAt: string
  lastTriggeredAt?: string
  secret?: string
}

export interface WebhookLog {
  id: number
  webhookId: number
  webhookName: string
  event: WebhookEventType
  status: 'success' | 'failure'
  statusCode?: number
  requestBody: any
  responseBody?: any
  error?: string
  triggeredAt: string
  duration: number // ms
}

export const webhookEventLabels: Record<WebhookEventType, string> = {
  approval_request_created: '承認依頼が作成された',
  approval_request_approved: '承認が完了した',
  approval_request_rejected: '承認が却下された',
  approval_request_commented: 'コメントが追加された',
  approval_request_completed: '全承認フローが完了した',
  approval_request_cancelled: '承認依頼がキャンセルされた',
}
