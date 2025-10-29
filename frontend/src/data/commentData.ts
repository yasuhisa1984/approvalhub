import { Comment } from '../types/comment'

export const mockComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      approvalId: 1,
      userId: 1,
      userName: '山田太郎',
      content: '契約内容を確認しました。問題ないと思いますので承認します。',
      createdAt: '2025-10-29 14:30:00',
      mentions: [],
    },
    {
      id: 2,
      approvalId: 1,
      userId: 3,
      userName: '鈴木一郎',
      content: 'ありがとうございます！念のため @佐藤花子 さんにも確認お願いします。',
      createdAt: '2025-10-29 14:35:00',
      mentions: [2],
    },
    {
      id: 3,
      approvalId: 1,
      userId: 2,
      userName: '佐藤花子',
      content: '了解しました。法務部門の確認も取れています。',
      createdAt: '2025-10-29 14:40:00',
      mentions: [],
      attachments: [
        {
          name: '法務確認書.pdf',
          url: '/files/legal_confirmation.pdf',
          size: 245678,
        },
      ],
    },
  ],
  2: [
    {
      id: 4,
      approvalId: 2,
      userId: 4,
      userName: '田中美咲',
      content: '領収書の添付をお願いします。',
      createdAt: '2025-10-28 10:20:00',
      mentions: [],
    },
    {
      id: 5,
      approvalId: 2,
      userId: 3,
      userName: '鈴木一郎',
      content: '添付しました。ご確認ください。',
      createdAt: '2025-10-28 11:15:00',
      mentions: [4],
      attachments: [
        {
          name: 'receipt_001.jpg',
          url: '/files/receipt_001.jpg',
          size: 1234567,
        },
        {
          name: 'receipt_002.jpg',
          url: '/files/receipt_002.jpg',
          size: 987654,
        },
      ],
    },
  ],
  3: [
    {
      id: 6,
      approvalId: 3,
      userId: 4,
      userName: '田中美咲',
      content: '@伊藤健太 さん、この候補者の面接評価はいかがでしたか？',
      createdAt: '2025-10-27 15:30:00',
      mentions: [5],
    },
    {
      id: 7,
      approvalId: 3,
      userId: 5,
      userName: '伊藤健太',
      content: '技術力は十分だと思います。コミュニケーション能力も問題ありません。',
      createdAt: '2025-10-27 16:45:00',
      mentions: [],
    },
  ],
}

export const getCommentsForApproval = (approvalId: number): Comment[] => {
  return mockComments[approvalId] || []
}

export const addComment = (comment: Comment): void => {
  if (!mockComments[comment.approvalId]) {
    mockComments[comment.approvalId] = []
  }
  mockComments[comment.approvalId].push(comment)
}
