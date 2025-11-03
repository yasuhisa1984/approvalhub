/**
 * ApprovalHub API Client
 * axios ベースのAPIクライアント
 * - JWT認証自動付与
 * - エラーハンドリング
 * - リトライロジック
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Base URL (環境変数から取得)
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

// Axios インスタンス作成
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15秒タイムアウト
});

// ========================================
// Request Interceptor (JWT自動付与)
// ========================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // LocalStorageからJWTトークンを取得
    const token = localStorage.getItem('jwt_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // テナントID (マルチテナント対応)
    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId && config.headers) {
      config.headers['X-Tenant-Id'] = tenantId;
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ========================================
// Response Interceptor (エラーハンドリング)
// ========================================
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('[API Response Error]', error);

    // エラーレスポンスの処理
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 認証エラー → ログイン画面へリダイレクト
          console.error('認証エラー: トークンが無効です');
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;

        case 403:
          // 権限エラー
          console.error('権限エラー: アクセス権がありません');
          break;

        case 404:
          // Not Found
          console.error('エラー: リソースが見つかりません');
          break;

        case 422:
          // バリデーションエラー
          console.error('バリデーションエラー:', data);
          break;

        case 500:
          // サーバーエラー
          console.error('サーバーエラー: システム管理者に連絡してください');
          break;

        default:
          console.error(`エラー (${status}):`, data);
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない
      console.error('ネットワークエラー: サーバーに接続できません');
    } else {
      // リクエスト設定でエラー
      console.error('リクエストエラー:', error.message);
    }

    return Promise.reject(error);
  }
);

// ========================================
// API関数
// ========================================

/**
 * 認証API
 */
export const authApi = {
  /**
   * ログイン
   */
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * サインアップ
   */
  signup: async (data: { name: string; email: string; password: string; tenant_slug?: string }) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  /**
   * ログアウト
   */
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant_id');
    return response.data;
  },

  /**
   * ユーザー情報取得
   */
  getUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};

/**
 * 承認API
 */
export const approvalApi = {
  /**
   * 承認一覧取得
   */
  getApprovals: async (params?: { status?: string; limit?: number; page?: number }) => {
    const response = await api.get('/api/approvals', { params });
    return response.data;
  },

  /**
   * 自分の申請一覧取得
   */
  getMyApprovals: async (params?: { status?: string }) => {
    const response = await api.get('/api/approvals', {
      params: { ...params, my: true }
    });
    return response.data;
  },

  /**
   * 承認詳細取得
   */
  getApprovalById: async (id: number) => {
    const response = await api.get(`/api/approvals/${id}`);
    return response.data;
  },

  /**
   * 承認ルート一覧取得
   */
  getApprovalRoutes: async () => {
    const response = await api.get('/api/approval-routes');
    return response.data;
  },

  /**
   * 承認申請作成
   */
  createApproval: async (data: {
    title: string;
    description: string;
    route_id: number;
    template_id?: number;
    form_data?: Record<string, any>;
    attachments?: File[];
  }) => {
    const response = await api.post('/api/approvals', data);
    return response.data;
  },

  /**
   * 承認実行
   */
  approve: async (id: number, comment?: string) => {
    const response = await api.post(`/api/approvals/${id}/approve`, { comment });
    return response.data;
  },

  /**
   * 差し戻し実行
   */
  reject: async (id: number, comment?: string) => {
    const response = await api.post(`/api/approvals/${id}/reject`, { comment });
    return response.data;
  },

  /**
   * 承認取り下げ
   */
  withdraw: async (id: number, comment?: string) => {
    const response = await api.post(`/api/approvals/${id}/withdraw`, { comment });
    return response.data;
  },

  /**
   * 承認ルート作成
   */
  createRoute: async (data: {
    name: string;
    description?: string;
    is_active?: boolean;
    steps: Array<{
      step_order: number;
      approver_id: number;
      is_required?: boolean;
      is_parallel_group?: boolean;
      parallel_requirement?: 'all' | 'any';
    }>;
  }) => {
    const response = await api.post('/api/approval-routes', data);
    return response.data;
  },

  /**
   * 承認ルート更新
   */
  updateRoute: async (
    id: number,
    data: {
      name?: string;
      description?: string;
      is_active?: boolean;
      steps?: Array<{
        step_order: number;
        approver_id: number;
        is_required?: boolean;
        is_parallel_group?: boolean;
        parallel_requirement?: 'all' | 'any';
      }>;
    }
  ) => {
    const response = await api.put(`/api/approval-routes/${id}`, data);
    return response.data;
  },

  /**
   * 承認ルート削除
   */
  deleteRoute: async (id: number) => {
    const response = await api.delete(`/api/approval-routes/${id}`);
    return response.data;
  },
};

/**
 * ユーザー・チームAPI
 */
export const userApi = {
  /**
   * ユーザー一覧取得
   */
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  /**
   * ユーザー作成
   */
  createUser: async (data: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/api/users', data);
    return response.data;
  },

  /**
   * ユーザー更新
   */
  updateUser: async (
    id: number,
    data: { name?: string; email?: string; password?: string; role?: string }
  ) => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },

  /**
   * ユーザー削除
   */
  deleteUser: async (id: number) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  /**
   * ユーザー招待
   */
  inviteUser: async (data: { email: string; name: string; role: string }) => {
    const response = await api.post('/api/users/invite', data);
    return response.data;
  },
};

/**
 * 通知API
 */
export const notificationApi = {
  /**
   * 通知一覧取得
   */
  getNotifications: async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  /**
   * 通知を既読にする
   */
  markAsRead: async (id: number) => {
    const response = await api.post(`/api/notifications/${id}/read`);
    return response.data;
  },
};

/**
 * 代理承認API
 */
export const delegationApi = {
  /**
   * 代理承認設定一覧取得
   */
  getDelegations: async () => {
    const response = await api.get('/api/delegations');
    return response.data;
  },

  /**
   * 代理承認設定作成
   */
  createDelegation: async (data: {
    delegate_user_id: number;
    start_date: string;
    end_date: string;
    reason: string;
  }) => {
    const response = await api.post('/api/delegations', data);
    return response.data;
  },

  /**
   * 代理承認設定削除
   */
  deleteDelegation: async (id: number) => {
    const response = await api.delete(`/api/delegations/${id}`);
    return response.data;
  },
};

/**
 * ファイルAPI
 */
export const fileApi = {
  /**
   * ファイルアップロード
   */
  upload: async (file: File, approval_id?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (approval_id) {
      formData.append('approval_id', approval_id.toString());
    }

    const response = await api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * ファイル情報取得
   */
  getFile: async (file_id: number) => {
    const response = await api.get(`/api/files/${file_id}`);
    return response.data;
  },

  /**
   * ファイル削除
   */
  deleteFile: async (file_id: number) => {
    const response = await api.delete(`/api/files/${file_id}`);
    return response.data;
  },

  /**
   * ファイル一覧取得
   */
  getFiles: async (approval_id?: number) => {
    const params = approval_id ? { approval_id } : {};
    const response = await api.get('/api/files', { params });
    return response.data;
  },
};

/**
 * フォームテンプレートAPI
 */
export const formTemplateApi = {
  /**
   * フォームテンプレート一覧取得
   */
  getTemplates: async () => {
    const response = await api.get('/api/form-templates');
    return response.data;
  },

  /**
   * フォームテンプレート作成
   */
  createTemplate: async (data: {
    name: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
    fields: any[];
  }) => {
    const response = await api.post('/api/form-templates', data);
    return response.data;
  },

  /**
   * フォームテンプレート更新
   */
  updateTemplate: async (id: number, data: {
    name: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
    fields: any[];
  }) => {
    const response = await api.put(`/api/form-templates/${id}`, data);
    return response.data;
  },

  /**
   * フォームテンプレート削除
   */
  deleteTemplate: async (id: number) => {
    const response = await api.delete(`/api/form-templates/${id}`);
    return response.data;
  },
};

/**
 * レポートAPI
 */
export const reportsApi = {
  /**
   * 統計情報取得
   */
  getStats: async () => {
    const response = await api.get('/api/reports/stats');
    return response.data;
  },

  /**
   * 月別データ取得
   */
  getMonthlyData: async () => {
    const response = await api.get('/api/reports/monthly');
    return response.data;
  },

  /**
   * 部署別データ取得
   */
  getDepartmentData: async () => {
    const response = await api.get('/api/reports/departments');
    return response.data;
  },
};

/**
 * WebhookAPI
 */
export const webhookApi = {
  /**
   * Webhook一覧取得
   */
  getWebhooks: async () => {
    const response = await api.get('/api/webhooks');
    return response.data;
  },

  /**
   * Webhook作成
   */
  createWebhook: async (data: {
    name: string;
    url: string;
    events: string[];
    is_active?: boolean;
    secret?: string;
  }) => {
    const response = await api.post('/api/webhooks', data);
    return response.data;
  },

  /**
   * Webhook更新
   */
  updateWebhook: async (id: number, data: {
    name: string;
    url: string;
    events: string[];
    is_active?: boolean;
    secret?: string;
  }) => {
    const response = await api.put(`/api/webhooks/${id}`, data);
    return response.data;
  },

  /**
   * Webhook削除
   */
  deleteWebhook: async (id: number) => {
    const response = await api.delete(`/api/webhooks/${id}`);
    return response.data;
  },

  /**
   * Webhookログ取得
   */
  getWebhookLogs: async (id: number) => {
    const response = await api.get(`/api/webhooks/${id}/logs`);
    return response.data;
  },
};

// デフォルトエクスポート
export default api;
