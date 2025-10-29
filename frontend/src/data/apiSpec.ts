export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  summary: string
  description: string
  tags: string[]
  auth: boolean
  parameters?: {
    name: string
    in: 'path' | 'query' | 'body' | 'header'
    required: boolean
    type: string
    description: string
  }[]
  requestBody?: {
    type: string
    properties: Record<string, { type: string; description: string; required?: boolean }>
  }
  responses: {
    code: number
    description: string
    example?: any
  }[]
}

export const apiEndpoints: APIEndpoint[] = [
  // 認証
  {
    method: 'POST',
    path: '/api/auth/login',
    summary: 'ログイン',
    description: 'メールアドレスとパスワードでログインし、JWTトークンを取得します',
    tags: ['認証'],
    auth: false,
    requestBody: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'メールアドレス', required: true },
        password: { type: 'string', description: 'パスワード', required: true },
      },
    },
    responses: [
      {
        code: 200,
        description: 'ログイン成功',
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            name: '山田太郎',
            email: 'yamada@example.com',
            role: 'admin',
          },
        },
      },
      { code: 401, description: '認証失敗' },
    ],
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    summary: 'ログアウト',
    description: 'ログアウトし、トークンを無効化します',
    tags: ['認証'],
    auth: true,
    responses: [{ code: 200, description: 'ログアウト成功' }],
  },

  // 申請
  {
    method: 'GET',
    path: '/api/approvals',
    summary: '申請一覧取得',
    description: '承認申請の一覧を取得します',
    tags: ['申請'],
    auth: true,
    parameters: [
      { name: 'status', in: 'query', required: false, type: 'string', description: 'ステータス (pending/approved/rejected)' },
      { name: 'page', in: 'query', required: false, type: 'number', description: 'ページ番号' },
      { name: 'limit', in: 'query', required: false, type: 'number', description: '1ページあたりの件数' },
    ],
    responses: [
      {
        code: 200,
        description: '成功',
        example: {
          data: [
            {
              id: 1,
              title: '新規取引先との契約書承認',
              status: 'pending',
              createdAt: '2025-10-29T10:00:00Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 100,
          },
        },
      },
    ],
  },
  {
    method: 'GET',
    path: '/api/approvals/:id',
    summary: '申請詳細取得',
    description: '指定IDの承認申請の詳細を取得します',
    tags: ['申請'],
    auth: true,
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'number', description: '申請ID' },
    ],
    responses: [
      {
        code: 200,
        description: '成功',
        example: {
          id: 1,
          title: '新規取引先との契約書承認',
          description: '契約内容の詳細...',
          status: 'pending',
          applicant: {
            id: 3,
            name: '鈴木一郎',
          },
          currentStep: 1,
          totalSteps: 2,
        },
      },
      { code: 404, description: '申請が見つかりません' },
    ],
  },
  {
    method: 'POST',
    path: '/api/approvals',
    summary: '新規申請作成',
    description: '新しい承認申請を作成します',
    tags: ['申請'],
    auth: true,
    requestBody: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'タイトル', required: true },
        description: { type: 'string', description: '詳細', required: true },
        routeId: { type: 'number', description: '承認ルートID', required: true },
      },
    },
    responses: [
      { code: 201, description: '作成成功' },
      { code: 400, description: 'バリデーションエラー' },
    ],
  },
  {
    method: 'POST',
    path: '/api/approvals/:id/approve',
    summary: '申請を承認',
    description: '指定IDの承認申請を承認します',
    tags: ['申請'],
    auth: true,
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'number', description: '申請ID' },
    ],
    requestBody: {
      type: 'object',
      properties: {
        comment: { type: 'string', description: 'コメント' },
      },
    },
    responses: [
      { code: 200, description: '承認成功' },
      { code: 403, description: '権限がありません' },
      { code: 404, description: '申請が見つかりません' },
    ],
  },
  {
    method: 'POST',
    path: '/api/approvals/:id/reject',
    summary: '申請を却下',
    description: '指定IDの承認申請を却下します',
    tags: ['申請'],
    auth: true,
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'number', description: '申請ID' },
    ],
    requestBody: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: '却下理由', required: true },
      },
    },
    responses: [
      { code: 200, description: '却下成功' },
      { code: 403, description: '権限がありません' },
    ],
  },

  // ユーザー
  {
    method: 'GET',
    path: '/api/users',
    summary: 'ユーザー一覧取得',
    description: 'テナント内のユーザー一覧を取得します',
    tags: ['ユーザー'],
    auth: true,
    responses: [
      {
        code: 200,
        description: '成功',
        example: {
          data: [
            {
              id: 1,
              name: '山田太郎',
              email: 'yamada@example.com',
              role: 'admin',
            },
          ],
        },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/users/invite',
    summary: 'ユーザー招待',
    description: '新しいユーザーを招待します',
    tags: ['ユーザー'],
    auth: true,
    requestBody: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'メールアドレス', required: true },
        role: { type: 'string', description: '権限 (admin/manager/member)', required: true },
        department: { type: 'string', description: '部署' },
      },
    },
    responses: [
      { code: 201, description: '招待メール送信成功' },
      { code: 400, description: 'バリデーションエラー' },
    ],
  },

  // テナント (スーパー管理者専用)
  {
    method: 'GET',
    path: '/api/superadmin/tenants',
    summary: 'テナント一覧取得',
    description: '全テナントの一覧を取得します (スーパー管理者専用)',
    tags: ['スーパー管理者'],
    auth: true,
    responses: [
      {
        code: 200,
        description: '成功',
        example: {
          data: [
            {
              id: 1,
              name: '株式会社サンプル',
              subdomain: 'sample-corp',
              plan: 'enterprise',
              status: 'active',
            },
          ],
        },
      },
      { code: 403, description: 'スーパー管理者権限が必要です' },
    ],
  },
  {
    method: 'POST',
    path: '/api/superadmin/tenants',
    summary: 'テナント作成',
    description: '新しいテナントを作成します (スーパー管理者専用)',
    tags: ['スーパー管理者'],
    auth: true,
    requestBody: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'テナント名', required: true },
        subdomain: { type: 'string', description: 'サブドメイン', required: true },
        contactEmail: { type: 'string', description: '担当者メール', required: true },
        plan: { type: 'string', description: 'プラン (free/pro/enterprise)', required: true },
      },
    },
    responses: [
      { code: 201, description: 'テナント作成成功' },
      { code: 400, description: 'バリデーションエラー' },
      { code: 409, description: 'サブドメインが既に使用されています' },
    ],
  },

  // 通知
  {
    method: 'GET',
    path: '/api/notifications',
    summary: '通知一覧取得',
    description: 'ユーザーの通知一覧を取得します',
    tags: ['通知'],
    auth: true,
    parameters: [
      { name: 'unread', in: 'query', required: false, type: 'boolean', description: '未読のみ取得' },
    ],
    responses: [
      {
        code: 200,
        description: '成功',
        example: {
          data: [
            {
              id: 1,
              type: 'approval_request',
              title: '承認依頼',
              message: '鈴木一郎さんから承認依頼が届いています',
              read: false,
              createdAt: '2025-10-29T13:30:00Z',
            },
          ],
        },
      },
    ],
  },
  {
    method: 'PUT',
    path: '/api/notifications/:id/read',
    summary: '通知を既読にする',
    description: '指定IDの通知を既読にします',
    tags: ['通知'],
    auth: true,
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'number', description: '通知ID' },
    ],
    responses: [
      { code: 200, description: '既読にしました' },
      { code: 404, description: '通知が見つかりません' },
    ],
  },
]

export const apiTags = [
  '認証',
  '申請',
  'ユーザー',
  'スーパー管理者',
  '通知',
]
