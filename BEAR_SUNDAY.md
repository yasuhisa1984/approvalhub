# ApprovalHub - BEAR.Sunday バックエンド設計書

## 🎯 なぜBEAR.Sundayなのか

### やっくん隊長に最適な理由

1. ✅ **PHP経験が活きる** - Laravelより学習コスト低い
2. ✅ **RESTful思想** - API設計が美しく、Reactと相性抜群
3. ✅ **DI/AOP完備** - keiri案件の知識がそのまま使える
4. ✅ **軽量・高速** - Laravelより2-3倍速い
5. ✅ **型安全** - PHPStanと組み合わせで堅牢

### Laravelではなく BEAR.Sunday

| 項目 | BEAR.Sunday | Laravel |
|------|-------------|---------|
| 学習曲線 | 急だが本質的 | 緩いが魔法が多い |
| API設計 | RESTful (リソース指向) | Controller (手続き的) |
| パフォーマンス | ⚡ 高速 | 普通 |
| DI/AOP | Ray.Di (強力) | Container (シンプル) |
| やっくん隊長 | **新しい挑戦** | 既知の技術 |

---

## 📂 プロジェクト構造

```
backend/                    # BEAR.Sunday プロジェクト
├── src/
│   ├── Resource/
│   │   └── App/           # API リソース
│   │       ├── Auth/
│   │       │   ├── Login.php        # POST /auth/login
│   │       │   └── Logout.php       # POST /auth/logout
│   │       ├── Approvals.php        # GET /approvals (一覧)
│   │       ├── Approval/
│   │       │   ├── Get.php          # GET /approval/{id}
│   │       │   ├── Create.php       # POST /approval
│   │       │   ├── Approve.php      # POST /approval/{id}/approve
│   │       │   └── Reject.php       # POST /approval/{id}/reject
│   │       ├── Routes.php           # GET /routes (承認ルート一覧)
│   │       └── User.php             # GET /user (自分の情報)
│   │
│   ├── Domain/            # ドメインロジック
│   │   ├── Approval/
│   │   │   ├── ApprovalService.php
│   │   │   ├── ApprovalEntity.php
│   │   │   └── ApprovalRepository.php
│   │   ├── User/
│   │   │   ├── UserRepository.php
│   │   │   └── UserEntity.php
│   │   └── Tenant/
│   │       └── TenantRepository.php
│   │
│   ├── Infrastructure/    # インフラ層
│   │   ├── Database/
│   │   │   └── PdoConnection.php
│   │   └── Auth/
│   │       ├── JwtAuth.php
│   │       └── TenantResolver.php
│   │
│   ├── Interceptor/       # AOP (keiri案件の知識活用!)
│   │   ├── TenantInterceptor.php    # マルチテナント自動設定
│   │   ├── AuthInterceptor.php      # 認証チェック
│   │   └── LogInterceptor.php       # ログ記録
│   │
│   └── Module/
│       ├── AppModule.php
│       └── DatabaseModule.php
│
├── var/
│   └── sql/
│       ├── schema.sql                # DDL
│       └── seed.sql                  # サンプルデータ
│
├── tests/
│   ├── Resource/
│   └── Domain/
│
└── composer.json
```

---

## 🔧 セットアップ手順

### 1. BEAR.Sunday プロジェクト作成

```bash
cd /Users/yasuhisa/work2025/approvalhub
composer create-project bear/skeleton backend
cd backend
```

### 2. PostgreSQL接続設定

```php
// src/Module/DatabaseModule.php
namespace MyVendor\ApprovalHub\Module;

use Ray\Di\AbstractModule;
use Ray\Di\Scope;

class DatabaseModule extends AbstractModule
{
    protected function configure()
    {
        $this->bind(\PDO::class)->toProvider(PdoProvider::class)->in(Scope::SINGLETON);
    }
}

// src/Infrastructure/Database/PdoProvider.php
namespace MyVendor\ApprovalHub\Infrastructure\Database;

use Ray\Di\ProviderInterface;

class PdoProvider implements ProviderInterface
{
    public function get(): \PDO
    {
        $dsn = 'pgsql:host=localhost;port=5432;dbname=approvalhub';
        $username = 'postgres';
        $password = 'password';

        return new \PDO($dsn, $username, $password, [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        ]);
    }
}
```

---

## 🎯 API設計 (RESTful)

### 認証

#### POST /auth/login
```json
// Request
{
  "email": "tanaka@demo.com",
  "password": "password"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "name": "田中部長",
    "email": "tanaka@demo.com",
    "role": "manager",
    "tenant_id": 1
  }
}
```

### 承認関連

#### GET /approvals
```json
// Query: ?status=pending&limit=20

// Response
{
  "data": [
    {
      "id": 1,
      "title": "新規取引先との業務委託契約",
      "status": "pending",
      "current_step": 1,
      "total_steps": 2,
      "applicant": {
        "id": 3,
        "name": "佐藤一般"
      },
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1
  }
}
```

#### POST /approval
```json
// Request
{
  "title": "サーバー購入申請",
  "description": "AWS EC2追加購入...",
  "route_id": 2,
  "attachments": []
}

// Response
{
  "id": 10,
  "title": "サーバー購入申請",
  "status": "pending",
  "created_at": "2025-01-15T14:00:00Z"
}
```

#### POST /approval/{id}/approve
```json
// Request
{
  "comment": "内容確認しました。承認します。"
}

// Response
{
  "id": 1,
  "status": "approved",
  "current_step": 2,
  "approved_at": "2025-01-15T14:30:00Z"
}
```

---

## 🔐 マルチテナント実装 (RLS + Interceptor)

### PostgreSQL Row Level Security

```sql
-- 全テーブルでRLS有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- ポリシー作成
CREATE POLICY tenant_isolation ON approvals
    USING (tenant_id = current_setting('app.current_tenant_id')::bigint);
```

### BEAR.Sunday Interceptor

```php
// src/Interceptor/TenantInterceptor.php
namespace MyVendor\ApprovalHub\Interceptor;

use Ray\Aop\MethodInterceptor;
use Ray\Aop\MethodInvocation;

class TenantInterceptor implements MethodInterceptor
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function invoke(MethodInvocation $invocation)
    {
        // JWTからテナントIDを取得
        $tenantId = $this->getTenantIdFromToken();

        // PostgreSQLセッション変数にセット
        $this->pdo->exec("SET app.current_tenant_id = {$tenantId}");

        // 本来の処理を実行
        return $invocation->proceed();
    }
}

// AppModule.phpで適用
$this->bindInterceptor(
    $this->matcher->subclassesOf(ResourceObject::class),
    $this->matcher->annotatedWith(RequireAuth::class),
    [TenantInterceptor::class]
);
```

**keiri案件のAOP思想をそのまま活用！**

---

## 📝 リソース実装例

### GET /approvals

```php
// src/Resource/App/Approvals.php
namespace MyVendor\ApprovalHub\Resource\App;

use BEAR\Resource\ResourceObject;
use MyVendor\ApprovalHub\Domain\Approval\ApprovalRepository;
use MyVendor\ApprovalHub\Annotation\RequireAuth;

class Approvals extends ResourceObject
{
    private $approvalRepo;

    public function __construct(ApprovalRepository $approvalRepo)
    {
        $this->approvalRepo = $approvalRepo;
    }

    /**
     * @RequireAuth
     */
    public function onGet(string $status = 'all', int $limit = 20): ResourceObject
    {
        $approvals = $this->approvalRepo->findByStatus($status, $limit);

        $this->body = [
            'data' => $approvals,
            'meta' => [
                'total' => count($approvals),
            ],
        ];

        return $this;
    }
}
```

### POST /approval/{id}/approve

```php
// src/Resource/App/Approval/Approve.php
namespace MyVendor\ApprovalHub\Resource\App\Approval;

use BEAR\Resource\ResourceObject;
use MyVendor\ApprovalHub\Domain\Approval\ApprovalService;
use MyVendor\ApprovalHub\Annotation\RequireAuth;

class Approve extends ResourceObject
{
    private $approvalService;

    public function __construct(ApprovalService $approvalService)
    {
        $this->approvalService = $approvalService;
    }

    /**
     * @RequireAuth
     */
    public function onPost(int $id, string $comment = ''): ResourceObject
    {
        // ドメインサービスで承認処理
        $approval = $this->approvalService->approve($id, $comment);

        $this->code = 200;
        $this->body = $approval;

        return $this;
    }
}
```

---

## 🧪 テスト戦略

### 必須テスト (MVP)

```php
// tests/Resource/App/ApprovalsTest.php
namespace MyVendor\ApprovalHub\Resource\App;

use BEAR\Resource\ResourceInterface;

class ApprovalsTest extends TestCase
{
    private $resource;

    public function testGetApprovals()
    {
        $ro = $this->resource->get('app://self/approvals', ['status' => 'pending']);

        $this->assertSame(200, $ro->code);
        $this->assertIsArray($ro->body['data']);
    }
}
```

---

## 🚀 開発フロー

### Week 2 スケジュール

#### Day 1-2: セットアップ
- [ ] BEAR.Sundayプロジェクト作成
- [ ] PostgreSQL接続
- [ ] マイグレーション実行
- [ ] サンプルデータ投入

#### Day 3-4: 認証・承認API
- [ ] POST /auth/login (JWT発行)
- [ ] GET /approvals (一覧)
- [ ] GET /approval/{id} (詳細)

#### Day 5-6: 承認アクションAPI
- [ ] POST /approval (作成)
- [ ] POST /approval/{id}/approve
- [ ] POST /approval/{id}/reject

#### Day 7: テスト・React連携
- [ ] APIテスト
- [ ] React側のaxios設定
- [ ] モック→API切り替え

---

## 💎 BEAR.Sundayの美しさ

### Laravelとの比較

#### Laravel (手続き的)
```php
// ApprovalController.php
public function approve(Request $request, $id)
{
    $approval = Approval::findOrFail($id);
    $approval->status = 'approved';
    $approval->save();
    return response()->json($approval);
}
```

#### BEAR.Sunday (リソース指向)
```php
// Approval/Approve.php
public function onPost(int $id): ResourceObject
{
    $this->body = $this->approvalService->approve($id);
    return $this;
}
```

**シンプル！美しい！RESTful！**

---

## 🎯 次のステップ

1. PostgreSQLインストール確認
2. BEAR.Sundayプロジェクト作成
3. マイグレーション実行
4. 最初のAPI実装

---

**やっくん隊長、BEAR.Sunday + PostgreSQL で最強のバックエンドを作りましょう！** 🚀

keiri案件のDI/AOP経験が完全に活きる設計です！
