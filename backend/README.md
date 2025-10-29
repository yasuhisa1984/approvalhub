# ApprovalHub Backend (BEAR.Sunday + PostgreSQL)

## 🚀 クイックスタート

### 1. PostgreSQLセットアップ

```bash
# PostgreSQLがインストールされているか確認
psql --version

# データベース作成
createdb approvalhub

# スキーマ作成
psql -d approvalhub -f schema.sql

# サンプルデータ投入
psql -d approvalhub -f seed.sql
```

### 2. BEAR.Sundayセットアップ

```bash
# Composerでプロジェクト作成
composer create-project bear/skeleton backend
cd backend

# 依存パッケージ追加
composer require firebase/php-jwt
composer require --dev phpunit/phpunit
```

### 3. 動作確認

```bash
# PostgreSQL接続確認
psql -d approvalhub -c "SELECT * FROM users;"

# BEAR.Sunday起動 (組み込みサーバー)
php -S 127.0.0.1:8080 -t public
```

---

## 📂 プロジェクト構造

```
backend/
├── schema.sql                    # PostgreSQL DDL
├── seed.sql                      # サンプルデータ
├── README.md                     # このファイル
│
└── (BEAR.Sundayプロジェクトはcomposer create-project後に作成)
    ├── src/
    │   ├── Resource/App/        # APIリソース
    │   ├── Domain/              # ドメインロジック
    │   ├── Infrastructure/      # インフラ層
    │   └── Interceptor/         # AOP
    │
    └── composer.json
```

---

## 🔧 PostgreSQL設定

### Row Level Security (RLS)

```sql
-- マルチテナント分離のポリシーが設定済み
-- アプリケーション側で以下を実行:

SET app.current_tenant_id = 1;

-- これでテナントIDが1のデータのみアクセス可能
```

---

## 🎯 API設計

| Method | Path | 説明 |
|--------|------|------|
| POST | /auth/login | ログイン (JWT発行) |
| GET | /approvals | 承認一覧 |
| GET | /approval/{id} | 承認詳細 |
| POST | /approval | 申請作成 |
| POST | /approval/{id}/approve | 承認実行 |
| POST | /approval/{id}/reject | 差し戻し |
| GET | /routes | 承認ルート一覧 |
| GET | /user | 自分の情報 |

---

## 📊 サンプルデータ

### ユーザー
- やっくん隊長 (admin) - yakkun@demo.com
- 田中部長 (manager) - tanaka@demo.com
- 佐藤一般 (member) - sato@demo.com

**全ユーザー共通パスワード**: `password`

### 承認ルート
1. 契約書承認フロー (2段階)
2. 経費申請フロー (3段階)
3. 人事施策承認フロー (3段階)
4. 簡易承認フロー (1段階)

### 申請
- 新規取引先との業務委託契約 (承認待ち)
- 開発環境サーバー購入申請 (承認待ち)
- 新卒採用計画の承認依頼 (2段階目)

---

## 🧪 動作確認SQL

```sql
-- テナント確認
SELECT * FROM tenants;

-- ユーザー一覧
SELECT id, name, email, role FROM users;

-- 承認ルート一覧
SELECT ar.name, COUNT(ars.id) as steps
FROM approval_routes ar
LEFT JOIN approval_route_steps ars ON ar.id = ars.route_id
GROUP BY ar.id, ar.name;

-- 承認待ち一覧 (田中部長の視点)
SET app.current_tenant_id = 1;
SELECT
    a.id,
    a.title,
    u.name as applicant,
    a.status,
    a.current_step
FROM approvals a
INNER JOIN users u ON a.applicant_id = u.id
WHERE a.current_approver_id = 2
  AND a.status = 'pending';
```

---

## 🎯 次のステップ

### Week 2 タスク

#### Day 1-2: BEAR.Sundayセットアップ
- [ ] composer create-project bear/skeleton backend
- [ ] PostgreSQL接続設定
- [ ] 基本的なResourceクラス作成

#### Day 3-4: 認証・承認API
- [ ] POST /auth/login (JWT発行)
- [ ] GET /approvals (一覧)
- [ ] GET /approval/{id} (詳細)
- [ ] TenantInterceptor実装 (RLS設定)

#### Day 5-6: 承認アクション
- [ ] POST /approval (作成)
- [ ] POST /approval/{id}/approve
- [ ] POST /approval/{id}/reject
- [ ] 承認履歴記録

#### Day 7: テスト・フロント連携
- [ ] PHPUnitテスト
- [ ] CORS設定
- [ ] React側axios設定
- [ ] モック→API切り替え

---

## 💎 BEAR.Sundayの美しさ

### RESTfulリソース指向

```php
// src/Resource/App/Approvals.php
class Approvals extends ResourceObject
{
    public function onGet(string $status = 'pending'): ResourceObject
    {
        $this->body = $this->approvalRepo->findByStatus($status);
        return $this;
    }
}

// GET /approvals?status=pending
// → シンプル！美しい！
```

---

## 🔐 マルチテナント実装

### PostgreSQL RLS + BEAR.Sunday Interceptor

```php
// TenantInterceptor.php
public function invoke(MethodInvocation $invocation)
{
    $tenantId = $this->getTenantIdFromJwt();
    $this->pdo->exec("SET app.current_tenant_id = {$tenantId}");
    return $invocation->proceed();
}
```

**keiri案件のAOP思想そのまま！**

---

**Built with ❤️ by やっくん隊長 | BEAR.Sunday + PostgreSQL**
