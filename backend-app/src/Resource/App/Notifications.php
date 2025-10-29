<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App;

use BEAR\Resource\ResourceObject;

class Notifications extends ResourceObject
{
    /**
     * GET /notifications - 通知一覧取得
     *
     * @param bool|null $unread
     */
    public function onGet(?bool $unread = null): static
    {
        // 本番環境ではDBから取得
        $allNotifications = $this->getMockNotifications();

        // 未読フィルタ
        if ($unread !== null) {
            $allNotifications = array_filter(
                $allNotifications,
                fn ($n) => $n['read'] === ! $unread
            );
        }

        $this->code = 200;
        $this->body = [
            'data' => array_values($allNotifications),
        ];

        return $this;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getMockNotifications(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'approval_request',
                'title' => '承認依頼',
                'message' => '鈴木一郎さんから承認依頼が届いています',
                'read' => false,
                'relatedId' => 1,
                'relatedType' => 'approval',
                'createdAt' => '2025-10-29T13:30:00Z',
            ],
            [
                'id' => 2,
                'type' => 'approval_approved',
                'title' => '承認完了',
                'message' => 'あなたの申請「経費精算申請」が承認されました',
                'read' => false,
                'relatedId' => 2,
                'relatedType' => 'approval',
                'createdAt' => '2025-10-28T16:30:00Z',
            ],
            [
                'id' => 3,
                'type' => 'mention',
                'title' => 'メンション',
                'message' => '山田太郎さんがあなたをメンションしました',
                'read' => true,
                'relatedId' => 3,
                'relatedType' => 'comment',
                'createdAt' => '2025-10-27T10:15:00Z',
            ],
            [
                'id' => 4,
                'type' => 'system',
                'title' => 'システム通知',
                'message' => 'メンテナンスのお知らせ：2025年11月1日 2:00-4:00',
                'read' => true,
                'relatedId' => null,
                'relatedType' => null,
                'createdAt' => '2025-10-26T09:00:00Z',
            ],
        ];
    }
}
