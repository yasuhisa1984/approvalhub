<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Approvals\ApprovalId;

use BEAR\Resource\ResourceObject;

class Reject extends ResourceObject
{
    /**
     * POST /approvals/{id}/reject - 申請を却下
     *
     * @param array{reason: string} $body
     */
    public function onPost(int $id, array $body): static
    {
        // バリデーション
        if (empty($body['reason'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => '却下理由は必須です',
                ],
            ];

            return $this;
        }

        // 権限チェック
        $hasPermission = $this->checkRejectPermission($id);
        if (! $hasPermission) {
            $this->code = 403;
            $this->body = [
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'この申請を却下する権限がありません',
                ],
            ];

            return $this;
        }

        // 却下処理（本番ではDB更新）
        $result = $this->rejectApproval($id, $body['reason']);

        if (! $result) {
            $this->code = 404;
            $this->body = [
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => '申請が見つかりません',
                ],
            ];

            return $this;
        }

        $this->code = 200;
        $this->body = [
            'message' => '申請を却下しました',
            'reason' => $body['reason'],
        ];

        return $this;
    }

    private function checkRejectPermission(int $id): bool
    {
        // デモ実装：常にtrue
        return true;
    }

    private function rejectApproval(int $id, string $reason): bool
    {
        // 本番ではDB更新
        // - 申請のステータスをrejectedに変更
        // - 却下理由を保存
        // - 申請者に通知

        return true;
    }
}
