export interface Comment {
  id: number
  approvalId: number
  userId: number
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  mentions: number[] // ユーザーIDの配列
  attachments?: {
    name: string
    url: string
    size: number
  }[]
}

export interface CommentDraft {
  content: string
  mentions: number[]
  attachments: File[]
}
