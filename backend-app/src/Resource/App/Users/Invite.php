<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Users;

use BEAR\Resource\ResourceObject;

class Invite extends ResourceObject
{
    /**
     * POST /users/invite - ユーザー招待
     *
     * @param array{email: string, role: string, department?: string} $body
     */
    public function onPost(array $body): static
    {
        // バリデーション
        if (empty($body['email']) || empty($body['role'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'メールアドレスと権限は必須です',
                ],
            ];

            return $this;
        }

        // 権限バリデーション
        $validRoles = ['admin', 'manager', 'member'];
        if (! in_array($body['role'], $validRoles, true)) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => '権限は admin, manager, member のいずれかである必要があります',
                ],
            ];

            return $this;
        }

        // メールアドレス形式チェック
        if (! filter_var($body['email'], FILTER_VALIDATE_EMAIL)) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => '有効なメールアドレスを入力してください',
                ],
            ];

            return $this;
        }

        // 本番環境では
        // 1. DBにユーザー招待レコードを作成
        // 2. 招待トークンを生成
        // 3. SendGridで招待メールを送信

        $this->code = 201;
        $this->body = [
            'message' => '招待メールを送信しました',
            'email' => $body['email'],
            'role' => $body['role'],
            'inviteToken' => bin2hex(random_bytes(32)), // デモ用トークン
        ];

        return $this;
    }
}
