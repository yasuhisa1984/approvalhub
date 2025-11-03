# 🔐 ベーシック認証の設定方法

## 概要

本番環境でアプリケーションへのアクセスを制限するため、シンプルなパスワード認証を実装しています。
開発環境では認証は無効化されており、本番環境のみで有効になります。

## 環境変数の設定

### ローカル開発環境（認証無効）

開発時は `.env.development` で認証を無効化しています：

```bash
# .env.development
VITE_BASIC_AUTH_ENABLED=false
```

### 本番環境（認証有効）

#### 方法1: ローカルで本番ビルドをテストする場合

`.env.production` ファイルを編集：

```bash
# .env.production
VITE_BASIC_AUTH_ENABLED=true
VITE_BASIC_AUTH_PASSWORD=your-secure-password-here
```

**⚠️ 重要**: `.env.production` はGitに含まれません（.gitignoreに追加済み）

ローカルで本番ビルドをテスト：
```bash
npm run build
npm run preview
```

#### 方法2: Vercelで本番デプロイする場合

Vercelダッシュボードで環境変数を設定します：

1. Vercelプロジェクトページにアクセス
2. **Settings** > **Environment Variables** を開く
3. 以下の環境変数を追加：

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_BASIC_AUTH_ENABLED` | `true` | Production |
| `VITE_BASIC_AUTH_PASSWORD` | `任意の安全なパスワード` | Production |

4. **Save** をクリック
5. 再デプロイ（または自動デプロイ）

## 使用方法

### 認証画面

本番環境にアクセスすると、以下の認証画面が表示されます：

- ApprovalHub ロゴ
- パスワード入力フィールド
- 「開発中のため、アクセスには認証が必要です」メッセージ

### ログイン

1. 設定したパスワードを入力
2. 「認証」ボタンをクリック
3. セッション中はログイン状態が維持されます

### ログアウト

ブラウザのタブを閉じるか、セッションストレージをクリアすると自動的にログアウトされます。

## セキュリティに関する注意

### ✅ 実装されている対策

- パスワードはセッションストレージに保存（ページリロード時も維持）
- 環境変数は `.gitignore` に追加済み（Git管理外）
- 本番環境のみ認証が有効（開発時は無効）

### ⚠️ 制限事項

この実装は**簡易的な認証**です。以下の点にご注意ください：

- クライアントサイド認証のため、技術的には回避可能
- 本格的なセキュリティが必要な場合は、以下を検討してください：
  - Vercel Password Protection（Proプラン）
  - サーバーサイド認証（Next.js Middleware等）
  - OAuth/SSO実装

### 🔒 推奨事項

1. **強力なパスワードを使用**
   - 最低12文字以上
   - 英数字と記号を組み合わせる
   - 例: `Xp9!mK#7zL@4qW2n`

2. **定期的なパスワード変更**
   - Vercelの環境変数を更新
   - 再デプロイ

3. **アクセス制限の併用**
   - Vercelの IP Allowlist（Enterprise プラン）
   - VPN経由のアクセスのみ許可

## トラブルシューティング

### Q. 認証画面が表示されない

**A.** 以下を確認してください：
- `VITE_BASIC_AUTH_ENABLED` が `true` に設定されているか
- 本番環境でビルドされているか（`npm run build`）
- Vercelで環境変数が正しく設定されているか

### Q. パスワードを忘れた

**A.** Vercelの環境変数ページで `VITE_BASIC_AUTH_PASSWORD` を確認するか、新しいパスワードに変更して再デプロイしてください。

### Q. ログインできない

**A.** 以下を確認：
- パスワードが正確に入力されているか（スペースや改行に注意）
- Vercelの環境変数とローカルの `.env.production` が一致しているか
- ブラウザのキャッシュをクリアして再試行

### Q. 開発中も認証画面が出る

**A.** `.env.development` で `VITE_BASIC_AUTH_ENABLED=false` が設定されているか確認してください。設定後、開発サーバーを再起動：
```bash
npm run dev
```

## ファイル構成

```
frontend/
├── src/
│   └── components/
│       └── BasicAuth.tsx          # 認証コンポーネント
├── .env.development               # 開発環境設定（認証無効）
├── .env.production               # 本番環境設定（Gitに含まれない）
├── .gitignore                    # 環境変数ファイルを除外
└── BASIC_AUTH_SETUP.md          # このドキュメント
```

## 実装詳細

### コンポーネント構造

```typescript
<BasicAuth>
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
</BasicAuth>
```

### 認証フロー

1. `BasicAuth` コンポーネントが最初にマウント
2. 環境変数 `VITE_BASIC_AUTH_ENABLED` をチェック
3. `false` の場合 → 子コンポーネントを即座に表示
4. `true` の場合：
   - セッションストレージをチェック
   - 認証済み → 子コンポーネントを表示
   - 未認証 → パスワード入力画面を表示
5. パスワード入力後：
   - 検証成功 → セッションストレージに保存 → アプリケーション表示
   - 検証失敗 → エラーメッセージ表示

## 今後の改善案

- [ ] ログアウトボタンの追加
- [ ] パスワード変更通知機能
- [ ] 複数ユーザー対応（ユーザー名 + パスワード）
- [ ] ログイン試行回数制限
- [ ] サーバーサイド認証への移行

---

**最終更新**: 2025-11-02
**作成者**: やっくん隊長
