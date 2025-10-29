<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Auth;

use BEAR\Resource\ResourceObject;
use BEAR\Sunday\Inject\ResourceInject;

class Login extends ResourceObject
{
    use ResourceInject;

    /**
     * @param array{email: string, password: string} $body
     */
    public function onPost(array $body): static
    {
        // バリデーション
        if (empty($body['email']) || empty($body['password'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'メールアドレスとパスワードは必須です',
                ],
            ];

            return $this;
        }

        // デモ認証ロジック（本番ではDB確認 + パスワードハッシュ検証）
        $user = $this->authenticateUser($body['email'], $body['password']);

        if ($user === null) {
            $this->code = 401;
            $this->body = [
                'error' => [
                    'code' => 'AUTHENTICATION_FAILED',
                    'message' => 'メールアドレスまたはパスワードが正しくありません',
                ],
            ];

            return $this;
        }

        // JWT トークン生成（本番では実際のJWTライブラリを使用）
        $token = $this->generateToken($user);

        $this->code = 200;
        $this->body = [
            'token' => $token,
            'user' => $user,
        ];

        return $this;
    }

    /**
     * @return array{id: int, name: string, email: string, role: string, tenantId?: int, tenantName?: string}|null
     */
    private function authenticateUser(string $email, string $password): ?array
    {
        // デモ実装：3種類のユーザー
        if ($email === 'superadmin@approvalhub.com' && $password === 'password') {
            return [
                'id' => 999,
                'name' => 'スーパー管理者',
                'email' => $email,
                'role' => 'superadmin',
            ];
        }

        if ($email === 'admin@sample.co.jp' && $password === 'password') {
            return [
                'id' => 1,
                'name' => '山田太郎',
                'email' => $email,
                'role' => 'admin',
                'tenantId' => 1,
                'tenantName' => '株式会社サンプル',
            ];
        }

        if ($email === 'suzuki@example.com' && $password === 'password') {
            return [
                'id' => 3,
                'name' => '鈴木一郎',
                'email' => $email,
                'role' => 'member',
                'tenantId' => 1,
                'tenantName' => '株式会社サンプル',
            ];
        }

        return null;
    }

    /**
     * @param array<string, mixed> $user
     */
    private function generateToken(array $user): string
    {
        // デモ実装：base64エンコード（本番ではJWT）
        // 本番環境では firebase/php-jwt などを使用
        $payload = [
            'userId' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'tenantId' => $user['tenantId'] ?? null,
            'exp' => time() + (60 * 60 * 24 * 7), // 7日間有効
        ];

        return base64_encode(json_encode($payload, JSON_THROW_ON_ERROR));
    }
}
