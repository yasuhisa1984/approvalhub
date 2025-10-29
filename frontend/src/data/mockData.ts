import { User, Approval, ApprovalDetail } from '../types'

export const currentUser: User = {
  id: 2,
  name: '田中部長',
  email: 'tanaka@demo.com',
  role: 'manager',
}

export const mockApprovals: Approval[] = [
  {
    id: 1,
    title: '新規取引先との業務委託契約',
    description: '株式会社サンプルとの業務委託契約書の承認をお願いします。契約金額は年間300万円です。',
    status: 'pending',
    current_step: 1,
    total_steps: 2,
    applicant: {
      id: 3,
      name: '佐藤一般',
      email: 'sato@demo.com',
      role: 'member',
    },
    current_approver: currentUser,
    route_name: '契約書承認フロー',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: '開発環境サーバー購入申請',
    description: 'AWS EC2インスタンス (t3.large) を3台追加購入したいです。月額費用は約15万円の見込みです。',
    status: 'pending',
    current_step: 1,
    total_steps: 3,
    applicant: {
      id: 4,
      name: '鈴木エンジニア',
      email: 'suzuki@demo.com',
      role: 'member',
    },
    current_approver: currentUser,
    route_name: '経費申請フロー',
    created_at: '2025-01-14T15:20:00Z',
    updated_at: '2025-01-14T15:20:00Z',
  },
  {
    id: 3,
    title: '新卒採用計画の承認依頼',
    description: '2026年度新卒採用として、エンジニア5名、営業3名の計8名を採用予定です。',
    status: 'pending',
    current_step: 2,
    total_steps: 3,
    applicant: {
      id: 5,
      name: '山田人事',
      email: 'yamada@demo.com',
      role: 'member',
    },
    current_approver: {
      id: 1,
      name: 'やっくん隊長',
      email: 'yakkun@demo.com',
      role: 'admin',
    },
    route_name: '人事施策承認フロー',
    created_at: '2025-01-13T09:00:00Z',
    updated_at: '2025-01-14T11:30:00Z',
  },
]

export const mockApprovalDetail: ApprovalDetail = {
  ...mockApprovals[0],
  histories: [
    {
      id: 1,
      user: {
        id: 3,
        name: '佐藤一般',
        email: 'sato@demo.com',
        role: 'member',
      },
      action: 'commented',
      comment: '申請を作成しました。ご確認よろしくお願いします。',
      created_at: '2025-01-15T10:30:00Z',
      step_order: 0,
    },
  ],
}

export const mockStats = {
  pending: 5,
  approved_today: 3,
  rejected_today: 1,
  total_this_month: 28,
}
