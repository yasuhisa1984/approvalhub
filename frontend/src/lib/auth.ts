/**
 * ApprovalHub 認証ユーティリティ
 * JWT認証とLocalStorage管理
 */

// ユーザー型定義
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  tenant_id: number;
  avatar_url?: string;
}

// ローカルストレージのキー
const STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  USER: 'user',
  TENANT_ID: 'tenant_id',
} as const;

/**
 * ========================================
 * JWT Token 管理
 * ========================================
 */

/**
 * JWTトークンを保存
 */
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
};

/**
 * JWTトークンを取得
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
};

/**
 * JWTトークンを削除
 */
export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
};

/**
 * JWTトークンの有効性チェック (簡易版)
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // JWT のペイロード部分をデコード
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;

    // 有効期限チェック (exp は秒単位)
    if (exp && Date.now() >= exp * 1000) {
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * ========================================
 * User 管理
 * ========================================
 */

/**
 * ユーザー情報を保存
 */
export const setUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.TENANT_ID, String(user.tenant_id));
};

/**
 * ユーザー情報を取得
 */
export const getUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * ユーザー情報を削除
 */
export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
};

/**
 * ========================================
 * 認証状態チェック
 * ========================================
 */

/**
 * ログイン済みかチェック
 */
export const isAuthenticated = (): boolean => {
  return isTokenValid() && getUser() !== null;
};

/**
 * ログアウト処理
 */
export const logout = (): void => {
  removeToken();
  removeUser();
};

/**
 * ========================================
 * 権限チェック
 * ========================================
 */

/**
 * 管理者権限チェック
 */
export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};

/**
 * マネージャー権限以上チェック
 */
export const isManagerOrAbove = (): boolean => {
  const user = getUser();
  return user?.role === 'admin' || user?.role === 'manager';
};

/**
 * 特定の権限を持っているかチェック
 */
export const hasRole = (role: 'admin' | 'manager' | 'member'): boolean => {
  const user = getUser();
  return user?.role === role;
};

/**
 * ========================================
 * テナント情報
 * ========================================
 */

/**
 * テナントIDを取得
 */
export const getTenantId = (): number | null => {
  const tenantId = localStorage.getItem(STORAGE_KEYS.TENANT_ID);
  return tenantId ? parseInt(tenantId, 10) : null;
};

/**
 * ========================================
 * 初期化処理
 * ========================================
 */

/**
 * ログイン処理
 * @param token JWTトークン
 * @param user ユーザー情報
 */
export const login = (token: string, user: User): void => {
  setToken(token);
  setUser(user);
  console.log('✅ Login successful:', user.name);
};

/**
 * セッション確認 (ページ読み込み時など)
 */
export const checkSession = (): boolean => {
  if (!isAuthenticated()) {
    console.warn('⚠️ Session expired or not authenticated');
    logout();
    return false;
  }
  return true;
};
