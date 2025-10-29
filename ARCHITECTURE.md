# ApprovalHub アーキテクチャ設計書

## 🎯 設計思想

### なぜこの技術スタックを選んだのか

#### やっくん隊長が**一人で**戦うための最適解

1. **開発速度を最優先** - 3ヶ月でMVPリリース必須
2. **運用コスト最小化** - 月$10以下で100社まで対応
3. **既存知識の活用** - PHP/MySQL経験を活かす

---

## 🛠️ 技術スタック（最終決定版）

### フロントエンド

#### 選択肢A: React + Vite ✅ **採用**
```
- TypeScript + React 18
- Vite (超高速ビルド)
- TailwindCSS (CSS書かない)
- Shadcn/ui (コンポーネント使い回し)
```

**選んだ理由**:
- ✅ Reactは求人多い（転職も視野）
- ✅ Viteが爆速（開発体験良好）
- ✅ Shadcn/uiでデザイン時間ゼロ

#### 選択肢B: Vue.js（不採用の理由）
- ❌ 求人がReactより少ない
- ❌ Shadcn/uiがない

---

### バックエンド

#### 選択肢A: Laravel 11 ✅ **採用**
```
- PHP 8.3
- Laravel 11 (最新LTS)
- PostgreSQL 16
- Redis
```

**選んだ理由**:
- ✅ やっくん隊長のPHP経験が活きる
- ✅ Eloquent ORMで開発速度3倍
- ✅ マルチテナント対応が簡単
- ✅ 日本語情報が豊富

#### 選択肢B: Node.js + Express（不採用の理由）
- ❌ PHP経験が活かせない
- ❌ 型安全性でTypeScript必須（学習コスト）

#### 選択肢C: Go + Gin（不採用の理由）
- ❌ やっくん隊長が未経験
- ❌ MVP開発速度が遅い

---

### データベース

#### PostgreSQL 16 ✅ **採用**

**選んだ理由**:
- ✅ Row Level Security (RLS) でマルチテナント実装が簡単
- ✅ JSON型サポート（柔軟なスキーマ）
- ✅ 無料枠が充実（Railway: 512MB）

**MySQLではダメな理由**:
- ❌ RLS機能がない
- ❌ マルチテナントをアプリ層で実装（バグリスク高）

---

### インフラ

#### Phase 1: MVP期（~100社）✅ **採用**
```
- フロント: Vercel (無料枠)
- バックエンド: Railway ($5/月)
- DB: Railway内蔵PostgreSQL
- Redis: Upstash (無料枠)
- ファイル: Cloudflare R2 ($0.015/GB)
```

**月額コスト: $5 (¥750)**

#### Phase 2: スケール期（100社~）
```
- フロント: Vercel Pro ($20/月)
- バックエンド: Railway ($20/月)
- DB: Supabase Pro ($25/月)
- Redis: Upstash Pro ($10/月)
- CDN: Cloudflare Pro ($20/月)
```

**月額コスト: $95 (¥14,250)**
※売上¥50万達成後に移行

---

## 📂 ディレクトリ構造（keiri案件から学んだ教訓）

### keiri案件の良かった点をパクる

1. ✅ **DI Container導入** → Laravel標準DIを活用
2. ✅ **Service層の分離** → ビジネスロジックをControllerから分離
3. ✅ **AOP的思想** → Middleware/Event活用

### keiri案件の反省点

1. ❌ レガシーコードとの共存 → ApprovalHubは最初からクリーン
2. ❌ Smartyテンプレート → React SPAで完全分離
3. ❌ Repository層が過剰 → Eloquentで十分

---

## 🏗️ プロジェクト構造

```
approvalhub/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Shadcn/ui (再利用可能)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── dialog.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── approval/        # 承認機能
│   │   │   │   ├── ApprovalCard.tsx
│   │   │   │   ├── ApprovalList.tsx
│   │   │   │   ├── ApprovalDetail.tsx
│   │   │   │   └── ApprovalRouteBuilder.tsx  # ★ルート設定UI
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── ActivityFeed.tsx
│   │   │   └── settings/
│   │   │       ├── TeamSettings.tsx
│   │   │       └── NotificationSettings.tsx
│   │   │
│   │   ├── pages/               # ページコンポーネント
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   └── ForgotPassword.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── approval/
│   │   │   │   ├── ApprovalCreate.tsx
│   │   │   │   ├── ApprovalDetail.tsx
│   │   │   │   └── ApprovalHistory.tsx
│   │   │   └── settings/
│   │   │       ├── Profile.tsx
│   │   │       ├── Team.tsx
│   │   │       └── Billing.tsx
│   │   │
│   │   ├── hooks/               # カスタムフック
│   │   │   ├── useApproval.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useNotification.ts
│   │   │
│   │   ├── lib/                 # ユーティリティ
│   │   │   ├── api.ts          # API Client
│   │   │   ├── utils.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── types/               # TypeScript型定義
│   │   │   ├── approval.ts
│   │   │   ├── user.ts
│   │   │   └── tenant.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # Laravel 11
│   ├── app/
│   │   ├── Models/              # Eloquent Models
│   │   │   ├── Tenant.php      # テナント（組織）
│   │   │   ├── User.php        # ユーザー
│   │   │   ├── ApprovalRoute.php     # 承認ルート
│   │   │   ├── ApprovalRouteStep.php # 承認ルートステップ
│   │   │   ├── Approval.php          # 申請
│   │   │   ├── ApprovalHistory.php   # 承認履歴
│   │   │   └── Subscription.php      # サブスクリプション
│   │   │
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── LoginController.php
│   │   │   │   │   └── RegisterController.php
│   │   │   │   ├── ApprovalController.php
│   │   │   │   ├── ApprovalRouteController.php
│   │   │   │   ├── TenantController.php
│   │   │   │   └── WebhookController.php  # Stripe Webhook
│   │   │   │
│   │   │   ├── Middleware/
│   │   │   │   ├── TenantMiddleware.php   # ★マルチテナント分離
│   │   │   │   └── SubscriptionMiddleware.php  # プラン制限
│   │   │   │
│   │   │   └── Requests/
│   │   │       ├── ApprovalCreateRequest.php
│   │   │       └── ApprovalRouteRequest.php
│   │   │
│   │   ├── Services/            # ビジネスロジック (keiri案件から学んだ)
│   │   │   ├── ApprovalService.php
│   │   │   │   # - createApproval()
│   │   │   │   # - processApproval()
│   │   │   │   # - rejectApproval()
│   │   │   │   # - withdrawApproval()
│   │   │   ├── NotificationService.php
│   │   │   │   # - sendApprovalNotification()
│   │   │   │   # - sendSlackNotification()
│   │   │   │   # - sendEmailNotification()
│   │   │   ├── TenantService.php
│   │   │   │   # - createTenant()
│   │   │   │   # - inviteUser()
│   │   │   └── SubscriptionService.php
│   │   │       # - createSubscription()
│   │   │       # - cancelSubscription()
│   │   │       # - handleWebhook()
│   │   │
│   │   ├── Events/              # イベント駆動 (keiri案件のAOP思想)
│   │   │   ├── ApprovalCreated.php
│   │   │   ├── ApprovalApproved.php
│   │   │   └── ApprovalRejected.php
│   │   │
│   │   ├── Listeners/
│   │   │   ├── SendApprovalNotification.php
│   │   │   └── LogApprovalHistory.php
│   │   │
│   │   └── Policies/            # 権限管理
│   │       ├── ApprovalPolicy.php
│   │       └── TenantPolicy.php
│   │
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 2025_01_01_create_tenants_table.php
│   │   │   ├── 2025_01_01_create_users_table.php
│   │   │   ├── 2025_01_02_create_approval_routes_table.php
│   │   │   ├── 2025_01_02_create_approval_route_steps_table.php
│   │   │   ├── 2025_01_03_create_approvals_table.php
│   │   │   ├── 2025_01_03_create_approval_histories_table.php
│   │   │   └── 2025_01_04_create_subscriptions_table.php
│   │   │
│   │   └── seeders/
│   │       └── DemoDataSeeder.php
│   │
│   ├── routes/
│   │   ├── api.php             # API Routes
│   │   └── web.php
│   │
│   ├── tests/
│   │   ├── Feature/
│   │   │   ├── ApprovalTest.php
│   │   │   └── TenantTest.php
│   │   └── Unit/
│   │       └── ApprovalServiceTest.php
│   │
│   ├── .env.example
│   ├── composer.json
│   └── phpunit.xml
│
├── landing/                     # ランディングページ
│   └── landing.html            # 既に作成済み
│
└── docs/                        # ドキュメント
    ├── README.md               # 既に作成済み
    ├── ARCHITECTURE.md         # このファイル
    ├── DATABASE.md             # 次に作成
    ├── API.md                  # API仕様書
    └── DEPLOYMENT.md           # デプロイ手順
```

---

## 🔄 データフロー（keiri案件の良い設計を踏襲）

### 承認フロー例

```
1. ユーザーが申請作成
   Frontend (ApprovalCreate.tsx)
   ↓
   API POST /api/approvals
   ↓
   ApprovalController@store
   ↓
   ApprovalService->createApproval()  ← keiri案件のService層パターン
   ↓
   Event: ApprovalCreated ← keiri案件のAOP思想
   ↓
   Listener: SendApprovalNotification
   ↓
   NotificationService->sendEmail/Slack

2. 承認者が承認実行
   Frontend (ApprovalDetail.tsx)
   ↓
   API POST /api/approvals/{id}/approve
   ↓
   ApprovalController@approve
   ↓
   ApprovalService->processApproval()
   ↓
   - 現在のステップを更新
   - 次の承認者を決定
   - 履歴を記録
   ↓
   Event: ApprovalApproved
   ↓
   Listener: SendApprovalNotification (次の承認者へ)
```

---

## 🔐 セキュリティ設計

### マルチテナント分離（RLS方式）

#### PostgreSQL Row Level Security
```sql
-- すべてのテーブルで自動フィルタ
CREATE POLICY tenant_isolation ON approvals
  USING (tenant_id = current_setting('app.current_tenant_id')::int);
```

#### Laravel Middleware
```php
// TenantMiddleware.php
public function handle($request, Closure $next)
{
    $tenantId = Auth::user()->tenant_id;

    // PostgreSQL session変数にセット
    DB::statement("SET app.current_tenant_id = ?", [$tenantId]);

    // Eloquentでもグローバルスコープ追加
    Approval::addGlobalScope('tenant', function ($query) use ($tenantId) {
        $query->where('tenant_id', $tenantId);
    });

    return $next($request);
}
```

**keiri案件では手動WHERE句だったが、ApprovalHubは自動化で安全性向上**

---

## 🚀 パフォーマンス最適化

### キャッシュ戦略

```
1. ユーザーセッション → Redis (Upstash無料枠)
2. 承認ルート設定 → Redis (1時間キャッシュ)
3. ダッシュボード統計 → Redis (5分キャッシュ)
4. 静的アセット → Cloudflare CDN
```

### データベース最適化

```sql
-- インデックス設計
CREATE INDEX idx_approvals_tenant_status ON approvals(tenant_id, status);
CREATE INDEX idx_approvals_current_approver ON approvals(current_approver_id);
CREATE INDEX idx_approval_histories_approval_id ON approval_histories(approval_id);
```

---

## 📊 監視・ログ

### Phase 1: MVP期（無料ツール）
```
- エラー監視: Sentry (無料枠)
- ログ: Railway内蔵ログ
- Uptime監視: UptimeRobot (無料)
```

### Phase 2: スケール期
```
- APM: New Relic ($99/月)
- ログ分析: Datadog ($15/月)
```

---

## 🧪 テスト戦略

### やっくん隊長一人なので最小限に絞る

#### 必須テスト
```
1. Feature Test (Laravel)
   - 承認フローの統合テスト
   - API エンドポイントテスト

2. E2E Test (Playwright)
   - ログイン → 申請 → 承認 の一連フロー
```

#### 省略するテスト
```
❌ Unit Test (全部) → 開発速度優先
❌ Component Test → E2Eで十分
```

---

## 🎯 Next Steps

1. ✅ アーキテクチャ設計完了
2. 次: DATABASE.md作成（マルチテナントスキーマ設計）
3. その後: 実装開始（Week 1から）

---

**Built with ❤️ by やっくん隊長 | keiri案件の経験を全て注ぎ込んだ設計書**
