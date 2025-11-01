# ApprovalHub デプロイメントガイド

## 📋 目次
1. [前提条件](#前提条件)
2. [Supabaseセットアップ](#supabaseセットアップ)
3. [Render.comバックエンドデプロイ](#rendercomバックエンドデプロイ)
4. [Vercelフロントエンドデプロイ](#vercelフロントエンドデプロイ)
5. [動作確認](#動作確認)

---

## 前提条件

- GitHubアカウント（コード管理）
- Supabaseアカウント（データベース）✅ 完了
- Render.comアカウント（バックエンド）
- Vercelアカウント（フロントエンド）

---

## Supabaseセットアップ

### ✅ 完了済み

1. **プロジェクト作成**: `kvjbqsjqhijwgudszmno`
2. **スキーマ作成**: `backend/schema.sql` 実行完了
3. **サンプルデータ投入**: `backend/seed.sql` 実行完了
4. **接続情報取得**:
   - URL: `https://kvjbqsjqhijwgudszmno.supabase.co`
   - Database: `postgresql://postgres:ybUdS09hjNJTc9Ph@db.kvjbqsjqhijwgudszmno.supabase.co:5432/postgres`

---

## Render.comバックエンドデプロイ

### ステップ1: Render.comアカウント作成

1. https://render.com にアクセス
2. "Get Started for Free" をクリック
3. GitHubアカウントで連携

### ステップ2: 新しいWeb Serviceを作成

1. Dashboard → "New +" → "Web Service"
2. GitHubリポジトリを接続: `approvalhub`
3. 以下の設定を入力:

```
Name: approvalhub-backend
Region: Singapore (最も近いリージョン)
Branch: main
Root Directory: backend
Runtime: Docker
Instance Type: Free
```

### ステップ3: 環境変数を設定

Environment タブで以下を追加:

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://approvalhub-backend.onrender.com

DATABASE_URL=postgresql://postgres:ybUdS09hjNJTc9Ph@db.kvjbqsjqhijwgudszmno.supabase.co:5432/postgres

SUPABASE_URL=https://kvjbqsjqhijwgudszmno.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2amJxc2pxaGlqd2d1ZHN6bW5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkyMjE4MiwiZXhwIjoyMDc3NDk4MTgyfQ.Haj9IvWxCcdlO2V6LPNF0czJbNJgg-bzIJeq6r5WIZc

JWT_SECRET=p9XYlT+FNp8FQE0KjUAye1J9eKlan6NZO8mUbLeOjPo=
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=86400

CORS_ALLOWED_ORIGINS=https://approvalhub.vercel.app,http://localhost:5173

SESSION_LIFETIME=120
SESSION_DRIVER=cookie

LOG_LEVEL=info
LOG_CHANNEL=stderr
```

### ステップ4: Dockerfile作成（必要な場合）

`backend/Dockerfile` を確認してください。存在しない場合は作成が必要です。

---

## Vercelフロントエンドデプロイ

### ステップ1: Vercelアカウント作成

1. https://vercel.com にアクセス
2. "Start Deploying" をクリック
3. GitHubアカウントで連携

### ステップ2: プロジェクトをインポート

1. "Add New..." → "Project"
2. GitHubリポジトリを選択: `approvalhub`
3. 以下の設定を入力:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### ステップ3: 環境変数を設定

Environment Variables タブで追加:

```bash
VITE_API_BASE_URL=https://approvalhub-backend.onrender.com/api
```

### ステップ4: デプロイ

"Deploy" ボタンをクリック → 2-3分で完了

デプロイURL: `https://approvalhub-<random>.vercel.app`

---

## 動作確認

### 1. バックエンドAPIの確認

```bash
curl https://approvalhub-backend.onrender.com/health
```

期待される応答:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### 2. フロントエンドの確認

ブラウザで Vercel URLにアクセス:
- ログインページが表示されること
- デモユーザーでログイン可能なこと

### 3. テストユーザー

```
Email: yakkun@demo.com
Password: password
```

---

## トラブルシューティング

### バックエンドが起動しない

1. Render.com → Logs を確認
2. 環境変数が正しく設定されているか確認
3. DATABASE_URLの接続テスト

### フロントエンドからAPIに接続できない

1. CORS設定を確認
2. `VITE_API_BASE_URL` が正しいか確認
3. ブラウザのConsoleでエラーを確認

### データベース接続エラー

1. Supabase Dashboard → Settings → Database で接続文字列を確認
2. パスワードが正しいか確認
3. IP制限がかかっていないか確認

---

## コスト試算

### Freeプラン構成

| サービス | プラン | 月額 |
|---------|-------|------|
| Supabase | Free | ¥0 |
| Render.com | Free | ¥0 |
| Vercel | Hobby | ¥0 |
| **合計** | | **¥0** |

### 制限事項

- Render.com Free: 自動スリープ（15分未使用後）
- Supabase Free: 500MB DB, 2GB転送/月
- Vercel Hobby: 100GB帯域幅/月

---

## 次のステップ

1. ✅ Supabaseセットアップ完了
2. ⬜ Render.comデプロイ
3. ⬜ Vercelデプロイ
4. ⬜ カスタムドメイン設定（オプション）
5. ⬜ 本番データ投入
6. ⬜ モニタリング設定

---

## 参考リンク

- [Render.com Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [BEAR.Sunday Documentation](https://bearsunday.github.io/)
