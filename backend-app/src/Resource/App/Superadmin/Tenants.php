<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Superadmin;

use BEAR\Resource\ResourceObject;

class Tenants extends ResourceObject
{
    /**
     * GET /superadmin/tenants - テナント一覧取得
     */
    public function onGet(): static
    {
        // スーパー管理者権限チェック
        if (! $this->isSuperAdmin()) {
            $this->code = 403;
            $this->body = [
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'スーパー管理者権限が必要です',
                ],
            ];

            return $this;
        }

        // 本番環境ではDBから全テナントを取得
        $tenants = $this->getMockTenants();

        $this->code = 200;
        $this->body = [
            'data' => $tenants,
        ];

        return $this;
    }

    /**
     * POST /superadmin/tenants - テナント作成
     *
     * @param array{name: string, subdomain: string, contactEmail: string, plan: string} $body
     */
    public function onPost(array $body): static
    {
        // スーパー管理者権限チェック
        if (! $this->isSuperAdmin()) {
            $this->code = 403;
            $this->body = [
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'スーパー管理者権限が必要です',
                ],
            ];

            return $this;
        }

        // バリデーション
        if (empty($body['name']) || empty($body['subdomain']) ||
            empty($body['contactEmail']) || empty($body['plan'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'すべての必須項目を入力してください',
                ],
            ];

            return $this;
        }

        // プランバリデーション
        $validPlans = ['free', 'pro', 'enterprise'];
        if (! in_array($body['plan'], $validPlans, true)) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'プランは free, pro, enterprise のいずれかである必要があります',
                ],
            ];

            return $this;
        }

        // サブドメイン重複チェック（本番ではDB確認）
        if ($this->subdomainExists($body['subdomain'])) {
            $this->code = 409;
            $this->body = [
                'error' => [
                    'code' => 'SUBDOMAIN_ALREADY_EXISTS',
                    'message' => 'このサブドメインは既に使用されています',
                ],
            ];

            return $this;
        }

        // テナント作成（本番ではDB登録 + スキーマ作成）
        $newTenant = [
            'id' => 100,
            'name' => $body['name'],
            'subdomain' => $body['subdomain'],
            'contactEmail' => $body['contactEmail'],
            'plan' => $body['plan'],
            'status' => 'trial',
            'maxUsers' => $this->getMaxUsersByPlan($body['plan']),
            'currentUsers' => 0,
            'createdAt' => date('c'),
        ];

        $this->code = 201;
        $this->body = $newTenant;

        return $this;
    }

    private function isSuperAdmin(): bool
    {
        // 本番では認証トークンから判定
        return true; // デモ実装
    }

    private function subdomainExists(string $subdomain): bool
    {
        // 本番ではDB確認
        $existingSubdomains = ['sample-corp', 'tech-startup', 'global-trading'];

        return in_array($subdomain, $existingSubdomains, true);
    }

    private function getMaxUsersByPlan(string $plan): int
    {
        return match ($plan) {
            'free' => 5,
            'pro' => 50,
            'enterprise' => 99999,
            default => 5,
        };
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getMockTenants(): array
    {
        return [
            [
                'id' => 1,
                'name' => '株式会社サンプル',
                'subdomain' => 'sample-corp',
                'plan' => 'enterprise',
                'status' => 'active',
                'maxUsers' => 99999,
                'currentUsers' => 45,
                'maxStorage' => 1000,
                'usedStorage' => 234,
                'monthlyFee' => 98000,
                'currency' => 'JPY',
                'createdAt' => '2025-01-15T09:00:00Z',
                'lastActivityAt' => '2025-10-29T14:30:00Z',
            ],
            [
                'id' => 2,
                'name' => 'テックスタートアップ株式会社',
                'subdomain' => 'tech-startup',
                'plan' => 'pro',
                'status' => 'active',
                'maxUsers' => 50,
                'currentUsers' => 12,
                'maxStorage' => 100,
                'usedStorage' => 45,
                'monthlyFee' => 19800,
                'currency' => 'JPY',
                'createdAt' => '2025-02-20T10:30:00Z',
                'lastActivityAt' => '2025-10-28T16:20:00Z',
            ],
            [
                'id' => 3,
                'name' => '合同会社グローバルトレーディング',
                'subdomain' => 'global-trading',
                'plan' => 'free',
                'status' => 'trial',
                'maxUsers' => 5,
                'currentUsers' => 3,
                'maxStorage' => 10,
                'usedStorage' => 2,
                'monthlyFee' => 0,
                'currency' => 'JPY',
                'createdAt' => '2025-10-20T14:00:00Z',
                'lastActivityAt' => '2025-10-29T11:15:00Z',
            ],
        ];
    }
}
