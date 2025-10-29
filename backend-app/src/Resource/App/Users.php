<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App;

use BEAR\Resource\ResourceObject;

class Users extends ResourceObject
{
    /**
     * GET /users - ユーザー一覧取得
     */
    public function onGet(): static
    {
        // 本番環境ではDBから取得（テナントIDでフィルタ）
        $users = $this->getMockUsers();

        $this->code = 200;
        $this->body = [
            'data' => $users,
        ];

        return $this;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getMockUsers(): array
    {
        return [
            [
                'id' => 1,
                'name' => '山田太郎',
                'email' => 'yamada@example.com',
                'role' => 'admin',
                'department' => '経営企画部',
                'position' => '部長',
                'status' => 'active',
                'createdAt' => '2025-01-15T09:00:00Z',
            ],
            [
                'id' => 2,
                'name' => '田中次郎',
                'email' => 'tanaka@example.com',
                'role' => 'manager',
                'department' => '営業部',
                'position' => '課長',
                'status' => 'active',
                'createdAt' => '2025-02-01T10:30:00Z',
            ],
            [
                'id' => 3,
                'name' => '鈴木一郎',
                'email' => 'suzuki@example.com',
                'role' => 'member',
                'department' => '営業部',
                'position' => '一般',
                'status' => 'active',
                'createdAt' => '2025-03-10T14:15:00Z',
            ],
            [
                'id' => 4,
                'name' => '佐藤花子',
                'email' => 'sato@example.com',
                'role' => 'member',
                'department' => 'マーケティング部',
                'position' => '主任',
                'status' => 'active',
                'createdAt' => '2025-04-05T11:20:00Z',
            ],
        ];
    }
}
