<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Approvals\ApprovalId;

use BEAR\Resource\ResourceObject;

class Approve extends ResourceObject
{
    /**
     * POST /approvals/{id}/approve - 申請を承認
     *
     * @param array{comment?: string} $body
     */
    public function onPost(int $id, array $body = []): static
    {
        // 本番環境では権限チェック
        // - ユーザーが現在のステップの承認者か確認
        // - 申請が承認可能な状態か確認

        // 権限チェック（デモ実装）
        $hasPermission = $this->checkApprovalPermission($id);
        if (! $hasPermission) {
            $this->code = 403;
            $this->body = [
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'この申請を承認する権限がありません',
                ],
            ];

            return $this;
        }

        // 承認処理（本番ではDB更新 + 次のステップへ進める）
        $result = $this->approveApproval($id, $body['comment'] ?? null);

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
            'message' => '承認しました',
            'nextStep' => $result['nextStep'],
            'completed' => $result['completed'],
        ];

        return $this;
    }

    private function checkApprovalPermission(int $id): bool
    {
        // デモ実装：常にtrue
        // 本番では現在のユーザーが承認者かチェック
        return true;
    }

    /**
     * @return array{nextStep: int|null, completed: bool}|null
     */
    private function approveApproval(int $id, ?string $comment): ?array
    {
        // 本番ではDB更新
        // - 現在のステップを承認済みにする
        // - コメントを保存
        // - 次のステップがあれば進める
        // - なければ申請全体を承認済みにする

        return [
            'nextStep' => 2, // 次のステップ番号（最終ステップならnull）
            'completed' => false, // 全ステップ完了したか
        ];
    }
}
