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
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * ログアウト
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant_id');
    return response.data;
  },

  /**
   * ユーザー情報取得
   */
  getUser: async () => {
    const response = await api.get('/user');
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
    const response = await api.get('/approvals', { params });
    return response.data;
  },

  /**
   * 承認詳細取得
   */
  getApprovalById: async (id: number) => {
    const response = await api.get(`/approvals/${id}`);
    return response.data;
  },

  /**
   * 承認申請作成
   */
  createApproval: async (data: {
    title: string;
    description: string;
    route_id: number;
    attachments?: File[];
  }) => {
    const response = await api.post('/approvals', data);
    return response.data;
  },

  /**
   * 承認実行
   */
  approve: async (id: number, comment?: string) => {
    const response = await api.post(`/approvals/${id}/approve`, { comment });
    return response.data;
  },

  /**
   * 差し戻し実行
   */
  reject: async (id: number, comment?: string) => {
    const response = await api.post(`/approvals/${id}/reject`, { comment });
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
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * ユーザー招待
   */
  inviteUser: async (data: { email: string; name: string; role: string }) => {
    const response = await api.post('/users/invite', data);
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
    const response = await api.get('/notifications');
    return response.data;
  },

  /**
   * 通知を既読にする
   */
  markAsRead: async (id: number) => {
    const response = await api.post(`/notifications/${id}/read`);
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
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// デフォルトエクスポート
export default api;
