# ApprovalHub Frontend - クイックスタートガイド 🚀

## 📋 前提条件

- Node.js 18以上
- npm 9以上

## 🎯 ローカル開発環境のセットアップ

### 1. 依存関係のインストール

```bash
cd /home/yasuhisa/workspace/approvalhub/frontend
npm install
```

### 2. 環境変数の設定

`.env`ファイルが作成済みです：

```bash
VITE_API_BASE_URL=http://127.0.0.1:8080
VITE_APP_NAME=ApprovalHub
VITE_APP_VERSION=0.1.0
VITE_DEBUG=true
```

本番環境では`.env.production`を作成してください。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

## 🔧 バックエンドとの接続

### バックエンドを起動 (必須)

フロントエンドが正常に動作するには、バックエンドAPIが起動している必要があります。

```bash
# 別のターミナルで
cd /home/yasuhisa/workspace/approvalhub/backend-app

# PHPビルトインサーバーを起動
php -S 127.0.0.1:8080 -t public
```

### 動作確認

1. フロントエンド: http://localhost:5173
2. バックエンドAPI: http://127.0.0.1:8080

## 🔐 ログイン

デモアカウント:

| 役割 | メールアドレス | パスワード |
|------|--------------|-----------|
| スーパー管理者 | superadmin@approvalhub.com | password |
| テナント管理者 | admin@sample.co.jp | password |
| 一般ユーザー | suzuki@example.com | password |

## 📂 プロジェクト構造

```
frontend/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── ui/             # 再利用可能UIコンポーネント
│   │   │   └── Toast.tsx   # Toast通知
│   │   ├── Dashboard.tsx
│   │   ├── ApprovalDetail.tsx
│   │   ├── ApprovalCreate.tsx
│   │   └── Login.tsx
│   ├── contexts/           # React Context
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── lib/                # ユーティリティ
│   │   ├── api.ts         # API Client
│   │   └── auth.ts        # 認証ユーティリティ
│   ├── types/              # TypeScript型定義
│   ├── data/               # モックデータ
│   ├── App.tsx
│   └── main.tsx
├── .env                    # 環境変数
├── package.json
└── vite.config.ts
```

## 🛠️ 利用可能なコマンド

### 開発サーバー
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### プレビュー (ビルド後)
```bash
npm run preview
```

## 🎨 主要な実装機能

### ✅ 認証システム
- JWT認証
- 自動ログイン/ログアウト
- セッション管理
- 権限チェック

### ✅ 承認機能
- ダッシュボード
- 承認一覧表示
- 承認詳細
- 承認/差し戻し
- 申請作成

### ✅ UI/UX
- ローディング状態
- エラーハンドリング
- Toast通知 (成功/エラー/警告/情報)
- レスポンシブデザイン

## 🔌 API連携

### API Client (`src/lib/api.ts`)

```typescript
import { authApi, approvalApi } from '../lib/api'

// ログイン
const response = await authApi.login(email, password)

// 承認一覧取得
const approvals = await approvalApi.getApprovals({ status: 'pending' })

// 承認実行
await approvalApi.approve(approvalId, comment)
```

### Toast通知 (`src/contexts/ToastContext.tsx`)

```typescript
import { useToast } from '../contexts/ToastContext'

const toast = useToast()

// 成功メッセージ
toast.success('承認が完了しました！')

// エラーメッセージ
toast.error('エラーが発生しました', '詳細なメッセージ')

// 警告
toast.warning('注意が必要です')

// 情報
toast.info('お知らせ')
```

## 🐛 トラブルシューティング

### バックエンドに接続できない

1. バックエンドが起動しているか確認
```bash
curl http://127.0.0.1:8080
```

2. `.env`ファイルのAPI URLを確認
```bash
cat .env | grep VITE_API_BASE_URL
```

### ログインできない

1. ブラウザのコンソールでAPIエラーを確認
2. バックエンドのログを確認
3. JWT Tokenが正しく保存されているか確認 (DevTools > Application > LocalStorage)

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 📚 参考資料

- [React 18 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios Documentation](https://axios-http.com/)

## 🎯 次のステップ

1. バックエンドAPIの完全実装
2. メール通知機能
3. ファイルアップロード機能
4. E2Eテスト
5. 本番デプロイ (Vercel)

---

**Built with ❤️ by やっくん隊長**
