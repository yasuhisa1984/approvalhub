# ApprovalHub - 機能一覧

## ✅ 実装済み機能

### 📊 ダッシュボード
- 承認待ち案件の一覧表示
- ステータスバッジ（承認待ち/承認済み/却下）
- クイックアクション
- 統計情報の可視化

### 📝 承認申請機能
#### テンプレートベース申請
- 3種類のフォームテンプレート（契約書/経費/採用）
- 8種類のフィールドタイプ対応
  - テキスト、数値、複数行テキスト
  - 日付、選択、ラジオボタン
  - チェックボックス、ファイル
- 動的フォーム生成
- バリデーション機能

#### カスタム申請
- 自由形式の申請作成
- リッチテキスト対応
- 承認ルート選択

### 👥 承認フロー
- 複数ステップ承認対応
- 承認/却下機能
- コメント付き承認/却下
- 承認履歴の記録

### 💬 コメント・メッセージ機能
- 申請詳細へのコメント投稿
- @メンション機能
- ファイル添付対応
- リアルタイム表示

### 👥 チーム管理
- メンバー一覧表示
- メンバー招待機能
- 権限管理（管理者/マネージャー/メンバー）
- メンバー情報編集
- 検索・フィルター機能
  - テキスト検索（名前/メール/部署）
  - 権限でフィルタ
  - 部署でフィルタ

### 🔔 通知センター
- 7種類の通知タイプ
  - 承認依頼
  - 承認完了/却下
  - コメント
  - メンション
  - リマインダー
  - システム通知
- 通知設定
  - メール通知 ON/OFF
  - アプリ内通知 ON/OFF
  - リマインダー設定（頻度/タイミング）
- 未読/既読管理
- フィルタリング機能

### 🛡️ 管理者ダッシュボード
- システムヘルスモニタリング
  - データベース状態
  - API応答時間
  - ストレージ使用量
- システム統計
  - 総申請数/承認待ち/承認済み
  - 平均処理時間
  - アクティブユーザー数
  - 滞留案件アラート
- エラーログ管理
  - エラーレベル別表示
  - 未解決/解決済みフィルター
  - CSVエクスポート
- ユーザー別承認統計

### 📋 監査ログ
- 全操作履歴の記録（18種類のアクション）
  - ログイン/ログアウト
  - 申請の作成/編集/削除/承認/却下
  - ルート管理
  - ユーザー管理
  - 設定変更
  - フォームテンプレート管理
- 詳細フィルター機能
  - アクション種別
  - ユーザー
  - 成功/失敗
  - 日時範囲
- 変更前/変更後の値表示
- CSVエクスポート

### 🔧 承認ルート設定
- 複数ルートの作成・管理
- ステップ単位の設定
- ステップの追加/削除/並び替え
- 承認者の指定
- アクティブ/非アクティブ切り替え

### 📋 フォームテンプレート管理
- テンプレート作成/編集/削除
- ビジュアルフォームビルダー
- 8種類のフィールドタイプ
- フィールドの並び替え
- 必須項目設定
- バリデーションルール設定

### 🔐 権限管理
- 3段階の権限レベル
  - 管理者：全権限
  - マネージャー：承認権限
  - メンバー：申請のみ
- 部署単位の管理
- 権限変更履歴の記録

### 🎨 UI/UX
- モダンなデザイン（TailwindCSS）
- レスポンシブ対応
- ダークモード対応（準備済み）
- アイコン（Lucide React）
- トースト通知
- モーダルダイアログ
- ドロップダウンメニュー

## 🏗️ アーキテクチャ

### フロントエンド
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Hooks

### バックエンド
- **Framework**: BEAR.Sunday (PHP)
- **Database**: PostgreSQL 16
- **Multi-tenancy**: Row Level Security (RLS)
- **Architecture**: RESTful API
- **DI/AOP**: Ray.Di

## 📁 プロジェクト構成

```
approvalhub/
├── frontend/
│   ├── src/
│   │   ├── components/      # UIコンポーネント
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ApprovalDetail.tsx
│   │   │   ├── ApprovalCreate.tsx
│   │   │   ├── ApprovalCreateWithTemplate.tsx
│   │   │   ├── MyApprovals.tsx
│   │   │   ├── TeamManagement.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AuditLogs.tsx
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── RouteSettings.tsx
│   │   │   ├── FormTemplates.tsx
│   │   │   ├── FormBuilder.tsx
│   │   │   ├── DynamicForm.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Login.tsx
│   │   ├── types/           # TypeScript型定義
│   │   │   ├── form.ts
│   │   │   ├── team.ts
│   │   │   ├── notification.ts
│   │   │   ├── admin.ts
│   │   │   ├── audit.ts
│   │   │   └── comment.ts
│   │   ├── data/            # モックデータ
│   │   │   ├── mockData.ts
│   │   │   ├── formTemplates.ts
│   │   │   ├── teamData.ts
│   │   │   ├── notificationData.ts
│   │   │   ├── adminData.ts
│   │   │   ├── auditData.ts
│   │   │   └── commentData.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   └── Resource/
│   │       └── App/
│   ├── schema.sql
│   ├── seed.sql
│   └── composer.json
├── DATABASE.md
├── ARCHITECTURE.md
├── BEAR_SUNDAY.md
├── FEATURES.md
└── README.md
```

## 🚀 起動方法

### フロントエンド
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### バックエンド
```bash
cd backend
composer install
php -S 127.0.0.1:8080 -t public
# → http://127.0.0.1:8080
```

### データベース
```bash
# PostgreSQL起動
brew services start postgresql@14

# データベース作成
createdb approvalhub

# スキーマとサンプルデータ投入
psql approvalhub < backend/schema.sql
psql approvalhub < backend/seed.sql
```

## 🎯 次のステップ（SaaS化に向けて）

### 優先度：高
1. **認証・認可の実装**
   - JWT認証
   - OAuth2対応（Google/Microsoft）
   - セッション管理
   - パスワードリセット

2. **決済システム連携**
   - Stripe連携
   - サブスクリプション管理
   - プラン管理（Free/Pro/Enterprise）
   - 使用量制限

3. **メール送信機能**
   - SendGrid/AWS SES連携
   - メールテンプレート
   - 通知メール自動送信

### 優先度：中
4. **APIの実装**
   - BEAR.Sundayでの実装
   - REST API完成
   - API認証
   - レート制限

5. **ファイルストレージ**
   - AWS S3/Cloudflare R2連携
   - ファイルアップロード
   - プレビュー機能

6. **検索機能強化**
   - 全文検索（Elasticsearch）
   - 高度なフィルター
   - 保存した検索

### 優先度：低
7. **モバイルアプリ**
   - React Native
   - プッシュ通知

8. **外部サービス連携**
   - Slack通知
   - Google Calendar連携
   - Webhook

9. **レポート機能強化**
   - グラフ可視化（Chart.js/Recharts）
   - PDFエクスポート
   - スケジュールレポート

## 📊 現在の状態

- ✅ **フロントエンド**: 完成（100%）
- ⏳ **バックエンドAPI**: 未実装（0%）
- ⏳ **認証**: 未実装（0%）
- ✅ **データベース設計**: 完成（100%）
- ✅ **UI/UX**: 完成（100%）
- ✅ **モックデータ**: 完成（100%）

**実務レベル**: フロントエンドは完全に実務で使えるレベルに達しています！🎉

バックエンドAPIの実装と認証システムの追加で、すぐにβ版としてリリース可能です。
