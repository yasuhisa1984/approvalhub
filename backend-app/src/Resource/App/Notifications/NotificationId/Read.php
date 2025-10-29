<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Notifications\NotificationId;

use BEAR\Resource\ResourceObject;

class Read extends ResourceObject
{
    /**
     * PUT /notifications/{id}/read - 通知を既読にする
     */
    public function onPut(int $id): static
    {
        // 本番環境ではDB更新
        $success = $this->markAsRead($id);

        if (! $success) {
            $this->code = 404;
            $this->body = [
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => '通知が見つかりません',
                ],
            ];

            return $this;
        }

        $this->code = 200;
        $this->body = [
            'message' => '通知を既読にしました',
            'notificationId' => $id,
        ];

        return $this;
    }

    private function markAsRead(int $id): bool
    {
        // 本番ではDB更新
        // UPDATE notifications SET read = true WHERE id = :id AND user_id = :currentUserId

        return true; // デモ実装
    }
}
