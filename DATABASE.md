# ApprovalHub データベース設計書

## 🎯 設計方針（keiri案件の教訓を活かす）

### データベース: PostgreSQL 16 ✅ **最終決定**

**なぜPostgreSQLを選んだのか**:
- ✅ **Row Level Security (RLS)** - マルチテナントが超簡単
- ✅ **SQLインジェクション完全防御** - DB側で自動制御
- ✅ **コード量激減** - WHERE tenant_id = ? が不要
- ✅ **JSON型サポート** - 柔軟なスキーマ拡張
- ✅ **無料枠が充実** - Railway 512MB無料

**MySQLではなくPostgreSQLにした理由**:
- ❌ MySQL: RLS機能がない → アプリ層で実装必要
- ✅ PostgreSQL: RLS標準搭載 → 設定だけでOK

### keiri案件で学んだこと
1. ✅ **適切な正規化** - 無駄な JOIN を減らす
2. ✅ **承認履歴の完全記録** - 監査対応に必須
3. ✅ **ソフトデリート** - 削除も履歴として残す
4. ❌ **複雑すぎるリレーション** - ApprovalHubではシンプルに

---

## 📊 ER図（テキスト版）

```
┌─────────────┐
│  tenants    │ 組織（マルチテナント）
└──────┬──────┘
       │
       │ 1:N
       ↓
┌─────────────┐       ┌──────────────────┐
│    users    │       │  subscriptions   │ サブスクリプション管理
└──────┬──────┘       └──────────────────┘
       │
       │ 1:N
       ↓
┌──────────────────┐
│ approval_routes  │ 承認ルート (例: 「契約書承認フロー」)
└────────┬─────────┘
         │
         │ 1:N
         ↓
┌──────────────────────┐
│ approval_route_steps │ 承認ルートのステップ (例: 1段階目:部長, 2段階目:役員)
└──────────────────────┘
         │
         ↓ N:1
┌─────────────┐       ┌──────────────────────┐
│  approvals  │ 申請  │  approval_histories  │ 承認履歴
└──────┬──────┘       └──────────────────────┘
       │ 1:N              ↑
       └──────────────────┘
```

---

## 📋 テーブル設計

### 1. tenants (テナント・組織)

```sql
CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    max_users INT DEFAULT 3,
    max_approvals_per_month INT DEFAULT 3,
    stripe_customer_id VARCHAR(255),
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_stripe_customer_id ON tenants(stripe_customer_id);

-- サンプルデータ
INSERT INTO tenants (name, slug, plan, max_users, max_approvals_per_month)
VALUES ('デモ株式会社', 'demo', 'business', 20, 999999);
```

**keiri案件との違い**:
- ✅ プラン情報をテナントに持たせる（シンプル）
- ✅ stripe_customer_idで課金管理連携

---

### 2. users (ユーザー)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member' COMMENT 'admin, manager, member',
    avatar_url VARCHAR(500),
    email_verified_at TIMESTAMP,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(tenant_id, email) -- 同一テナント内でメール重複不可
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- Row Level Security (RLS) でマルチテナント分離
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON users
    USING (tenant_id = current_setting('app.current_tenant_id')::bigint);

-- サンプルデータ
INSERT INTO users (tenant_id, name, email, password, role)
VALUES
    (1, 'やっくん隊長', 'yakkun@demo.com', '$2y$10$...', 'admin'),
    (1, '田中部長', 'tanaka@demo.com', '$2y$10$...', 'manager'),
    (1, '佐藤一般', 'sato@demo.com', '$2y$10$...', 'member');
```

**keiri案件のadmin_usersから改善**:
- ✅ RLSで完全なテナント分離（SQLインジェクション対策）
- ✅ avatar_urlでプロフィール画像対応
- ✅ roleでシンプルな権限管理

---

### 3. subscriptions (サブスクリプション)

```sql
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' COMMENT 'active, canceled, past_due, trialing',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

**keiri案件にはなかった機能**:
- ✅ Stripe連携でサブスク管理
- ✅ Webhook対応でステータス自動更新

---

### 4. approval_routes (承認ルート)

```sql
CREATE TABLE approval_routes (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL COMMENT '承認ルート名 (例: 契約書承認フロー)',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_approval_routes_tenant_id ON approval_routes(tenant_id);

-- サンプルデータ
INSERT INTO approval_routes (tenant_id, name, description, created_by)
VALUES (1, '契約書承認フロー', '新規取引先との契約書用', 1);
```

**keiri案件のapproval_routesを踏襲**:
- ✅ シンプルな設計を維持
- ✅ is_activeで無効化対応

---

### 5. approval_route_steps (承認ルートステップ)

```sql
CREATE TABLE approval_route_steps (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT NOT NULL REFERENCES approval_routes(id) ON DELETE CASCADE,
    step_order INT NOT NULL COMMENT '承認順序 (1, 2, 3...)',
    approver_id BIGINT NOT NULL REFERENCES users(id),
    approver_name VARCHAR(255) COMMENT '承認者名（スナップショット）',
    is_required BOOLEAN DEFAULT TRUE COMMENT '必須承認か（将来の拡張用）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, step_order) -- 同じルート内でstep_orderが重複しない
);

CREATE INDEX idx_approval_route_steps_route_id ON approval_route_steps(route_id);
CREATE INDEX idx_approval_route_steps_approver_id ON approval_route_steps(approver_id);

-- サンプルデータ
INSERT INTO approval_route_steps (route_id, step_order, approver_id, approver_name)
VALUES
    (1, 1, 2, '田中部長'),   -- 1段階目
    (1, 2, 1, 'やっくん隊長'); -- 2段階目
```

**keiri案件のapproval_route_settingsを改善**:
- ✅ approver_nameでスナップショット保存（承認者変更でも履歴保持）
- ✅ is_requiredで柔軟な承認フロー対応（MVP後の拡張用）

---

### 6. approvals (申請)

```sql
CREATE TABLE approvals (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    route_id BIGINT NOT NULL REFERENCES approval_routes(id),
    applicant_id BIGINT NOT NULL REFERENCES users(id) COMMENT '申請者',
    title VARCHAR(255) NOT NULL COMMENT '申請タイトル',
    description TEXT COMMENT '申請内容',
    status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, approved, rejected, withdrawn',
    current_step INT DEFAULT 1 COMMENT '現在の承認ステップ',
    current_approver_id BIGINT REFERENCES users(id) COMMENT '現在の承認者',
    approved_at TIMESTAMP COMMENT '最終承認日時',
    rejected_at TIMESTAMP COMMENT '差し戻し日時',
    withdrawn_at TIMESTAMP COMMENT '取り下げ日時',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_approvals_tenant_id ON approvals(tenant_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_current_approver_id ON approvals(current_approver_id);
CREATE INDEX idx_approvals_applicant_id ON approvals(applicant_id);

-- 複合インデックス（よく使う検索条件）
CREATE INDEX idx_approvals_tenant_status_created ON approvals(tenant_id, status, created_at DESC);

-- サンプルデータ
INSERT INTO approvals (tenant_id, route_id, applicant_id, title, description, current_approver_id)
VALUES (1, 1, 3, '新規取引先との業務委託契約', '株式会社サンプルとの契約書承認依頼', 2);
```

**keiri案件のcontract_informationsから改善**:
- ✅ statusを分かりやすく（pending, approved, rejected, withdrawn）
- ✅ current_stepとcurrent_approver_idで承認進捗管理
- ✅ 各ステータスの日時を記録（監査対応）

---

### 7. approval_histories (承認履歴)

```sql
CREATE TABLE approval_histories (
    id BIGSERIAL PRIMARY KEY,
    approval_id BIGINT NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    user_name VARCHAR(255) COMMENT 'ユーザー名（スナップショット）',
    action VARCHAR(50) NOT NULL COMMENT 'approved, rejected, withdrawn, commented',
    step_order INT COMMENT '承認ステップ番号',
    comment TEXT COMMENT '承認/差し戻しコメント',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_histories_approval_id ON approval_histories(approval_id);
CREATE INDEX idx_approval_histories_user_id ON approval_histories(user_id);

-- サンプルデータ
INSERT INTO approval_histories (approval_id, user_id, user_name, action, step_order, comment)
VALUES (1, 2, '田中部長', 'approved', 1, '内容確認しました。承認します。');
```

**keiri案件のcontract_approval_historiesを踏襲**:
- ✅ 完全な監査証跡
- ✅ user_nameでスナップショット（ユーザー削除でも履歴保持）
- ✅ actionで柔軟なイベント記録

---

### 8. approval_attachments (添付ファイル)

```sql
CREATE TABLE approval_attachments (
    id BIGSERIAL PRIMARY KEY,
    approval_id BIGINT NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL COMMENT 'Cloudflare R2のパス',
    file_size BIGINT COMMENT 'バイト単位',
    mime_type VARCHAR(100),
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_attachments_approval_id ON approval_attachments(approval_id);
```

**keiri案件のファイル管理を改善**:
- ✅ Cloudflare R2で低コストストレージ
- ✅ mime_typeで安全なファイル管理

---

### 9. notifications (通知履歴)

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL COMMENT 'approval_request, approval_approved, approval_rejected',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500) COMMENT '通知からのリンク先',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**keiri案件にはなかった機能**:
- ✅ アプリ内通知機能
- ✅ 未読管理でUX向上

---

## 🔐 Row Level Security (RLS) 設定

### すべてのテーブルにRLS適用

```sql
-- 各テーブルに対して実行
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_route_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ポリシー作成（例: approvals）
CREATE POLICY tenant_isolation ON approvals
    USING (tenant_id = current_setting('app.current_tenant_id')::bigint);

-- Laravel側で設定
DB::statement("SET app.current_tenant_id = ?", [Auth::user()->tenant_id]);
```

**keiri案件との最大の違い**:
- ❌ keiri: WHERE tenant_id = ? を毎回手動記述
- ✅ ApprovalHub: RLSで自動フィルタ（SQLインジェクション完全防御）

---

## 📈 パフォーマンス最適化

### 1. インデックス戦略

```sql
-- よく使う検索パターンに対応
CREATE INDEX idx_approvals_dashboard ON approvals(tenant_id, status, current_approver_id, created_at DESC);

-- 部分インデックス（承認待ちのみ）
CREATE INDEX idx_approvals_pending ON approvals(current_approver_id)
WHERE status = 'pending';
```

### 2. パーティショニング（将来の拡張用）

```sql
-- 1000社以上になったらテナント別にパーティション
CREATE TABLE approvals_partitioned (
    LIKE approvals INCLUDING ALL
) PARTITION BY HASH (tenant_id);
```

---

## 🧪 サンプルクエリ

### 1. ダッシュボード: 承認待ち一覧

```sql
SELECT
    a.id,
    a.title,
    a.created_at,
    u_applicant.name AS applicant_name,
    ar.name AS route_name,
    a.current_step
FROM approvals a
INNER JOIN users u_applicant ON a.applicant_id = u_applicant.id
INNER JOIN approval_routes ar ON a.route_id = ar.id
WHERE a.tenant_id = 1
  AND a.current_approver_id = 2  -- ログインユーザーID
  AND a.status = 'pending'
ORDER BY a.created_at DESC;
```

**keiri案件のクエリを最適化**:
- ✅ 不要なJOINを削減
- ✅ インデックス活用で高速化

---

### 2. 承認実行時の処理

```sql
BEGIN;

-- 1. 承認履歴を記録
INSERT INTO approval_histories (approval_id, user_id, user_name, action, step_order, comment)
VALUES (1, 2, '田中部長', 'approved', 1, '承認します');

-- 2. 次のステップを取得
SELECT step_order, approver_id, approver_name
FROM approval_route_steps
WHERE route_id = (SELECT route_id FROM approvals WHERE id = 1)
  AND step_order = 2;  -- current_step + 1

-- 3. 申請を更新
UPDATE approvals
SET current_step = 2,
    current_approver_id = 1,  -- 次の承認者
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- 4. 全ステップ完了なら承認済みに
UPDATE approvals
SET status = 'approved',
    approved_at = CURRENT_TIMESTAMP,
    current_approver_id = NULL
WHERE id = 1
  AND NOT EXISTS (
      SELECT 1 FROM approval_route_steps
      WHERE route_id = (SELECT route_id FROM approvals WHERE id = 1)
        AND step_order > 2
  );

COMMIT;
```

**keiri案件のactionRouteRegistを参考**:
- ✅ トランザクション必須
- ✅ Laravel Serviceレイヤーで実装

---

## 🎯 マイグレーション順序

```bash
# Laravel migration
1. create_tenants_table
2. create_users_table
3. create_subscriptions_table
4. create_approval_routes_table
5. create_approval_route_steps_table
6. create_approvals_table
7. create_approval_histories_table
8. create_approval_attachments_table
9. create_notifications_table
```

---

## 📊 容量見積もり

### 100社運用時

```
- tenants: 100件 × 1KB = 100KB
- users: 500人 × 2KB = 1MB
- approvals: 10,000件/月 × 5KB = 50MB/月
- approval_histories: 30,000件/月 × 1KB = 30MB/月
- attachments: 5,000ファイル × 500KB = 2.5GB

合計: 約3GB/月
年間: 36GB

PostgreSQL Railway無料枠: 512MB → 即有料プラン必要
PostgreSQL Railway $5プラン: 1GB → 3ヶ月OK
```

**収益¥50万達成後にスケール検討**

---

## 🔄 バックアップ戦略

```bash
# 毎日自動バックアップ（Railway標準機能）
# 手動バックアップコマンド
pg_dump -h railway.host -U postgres -d approvalhub > backup_$(date +%Y%m%d).sql
```

---

## ✅ チェックリスト

- [x] テーブル設計完了
- [x] インデックス設計完了
- [x] RLS設定完了
- [x] サンプルクエリ作成
- [ ] Laravelマイグレーション作成（次のステップ）
- [ ] Seeder作成（次のステップ）

---

**Built with ❤️ by やっくん隊長 | keiri案件の10年分の経験を3ヶ月に凝縮**
