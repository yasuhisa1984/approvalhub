<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Approvals;

use BEAR\Resource\ResourceObject;

class ApprovalId extends ResourceObject
{
    /**
     * GET /approvals/{id} - 申請詳細取得
     */
    public function onGet(int $id): static
    {
        // 本番環境ではDBから取得
        $approval = $this->getApprovalById($id);

        if ($approval === null) {
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
        $this->body = $approval;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function getApprovalById(int $id): ?array
    {
        $approvals = [
            1 => [
                'id' => 1,
                'title' => '新規取引先との契約書承認',
                'description' => '新規取引先（ABC株式会社）との業務委託契約書の承認をお願いします。契約期間は2025年11月1日から2026年10月31日までの1年間です。',
                'status' => 'pending',
                'applicant' => [
                    'id' => 3,
                    'name' => '鈴木一郎',
                    'department' => '営業部',
                ],
                'currentStep' => 1,
                'totalSteps' => 2,
                'route' => [
                    [
                        'step' => 1,
                        'approverName' => '山田太郎',
                        'approverRole' => '課長',
                        'status' => 'pending',
                    ],
                    [
                        'step' => 2,
                        'approverName' => '佐藤部長',
                        'approverRole' => '部長',
                        'status' => 'waiting',
                    ],
                ],
                'createdAt' => '2025-10-29T10:00:00Z',
                'updatedAt' => '2025-10-29T10:00:00Z',
            ],
            2 => [
                'id' => 2,
                'title' => '経費精算申請（出張費）',
                'description' => '大阪出張の経費精算です。交通費：35,000円、宿泊費：12,000円、その他：3,000円',
                'status' => 'approved',
                'applicant' => [
                    'id' => 4,
                    'name' => '佐藤花子',
                    'department' => 'マーケティング部',
                ],
                'currentStep' => 2,
                'totalSteps' => 2,
                'route' => [
                    [
                        'step' => 1,
                        'approverName' => '山田太郎',
                        'approverRole' => '課長',
                        'status' => 'approved',
                        'approvedAt' => '2025-10-28T15:00:00Z',
                    ],
                    [
                        'step' => 2,
                        'approverName' => '経理部長',
                        'approverRole' => '部長',
                        'status' => 'approved',
                        'approvedAt' => '2025-10-28T16:30:00Z',
                    ],
                ],
                'createdAt' => '2025-10-28T14:30:00Z',
                'updatedAt' => '2025-10-28T16:30:00Z',
            ],
        ];

        return $approvals[$id] ?? null;
    }
}
