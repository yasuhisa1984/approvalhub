<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App;

use BEAR\Resource\ResourceObject;

class Approvals extends ResourceObject
{
    /**
     * GET /approvals - 申請一覧取得
     *
     * @param string|null $status
     * @param int         $page
     * @param int         $limit
     */
    public function onGet(
        ?string $status = null,
        int $page = 1,
        int $limit = 20
    ): static {
        // 本番環境ではDBから取得
        $allApprovals = $this->getMockApprovals();

        // ステータスフィルタリング
        if ($status !== null) {
            $allApprovals = array_filter(
                $allApprovals,
                fn ($approval) => $approval['status'] === $status
            );
        }

        // ページネーション
        $total = count($allApprovals);
        $offset = ($page - 1) * $limit;
        $paginatedData = array_slice($allApprovals, $offset, $limit);

        $this->code = 200;
        $this->body = [
            'data' => array_values($paginatedData),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => (int) ceil($total / $limit),
            ],
        ];

        return $this;
    }

    /**
     * POST /approvals - 新規申請作成
     *
     * @param array{title: string, description: string, routeId: int} $body
     */
    public function onPost(array $body): static
    {
        // バリデーション
        if (empty($body['title']) || empty($body['description']) || empty($body['routeId'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'タイトル、詳細、承認ルートIDは必須です',
                ],
            ];

            return $this;
        }

        // 本番環境ではDBに保存
        $newApproval = [
            'id' => 100, // 本番ではDBが自動採番
            'title' => $body['title'],
            'description' => $body['description'],
            'routeId' => $body['routeId'],
            'status' => 'pending',
            'createdAt' => date('c'),
        ];

        $this->code = 201;
        $this->body = $newApproval;

        return $this;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getMockApprovals(): array
    {
        return [
            [
                'id' => 1,
                'title' => '新規取引先との契約書承認',
                'status' => 'pending',
                'createdAt' => '2025-10-29T10:00:00Z',
                'applicant' => [
                    'id' => 3,
                    'name' => '鈴木一郎',
                ],
            ],
            [
                'id' => 2,
                'title' => '経費精算申請（出張費）',
                'status' => 'approved',
                'createdAt' => '2025-10-28T14:30:00Z',
                'applicant' => [
                    'id' => 4,
                    'name' => '佐藤花子',
                ],
            ],
            [
                'id' => 3,
                'title' => '新規プロジェクト予算承認',
                'status' => 'pending',
                'createdAt' => '2025-10-27T09:15:00Z',
                'applicant' => [
                    'id' => 5,
                    'name' => '田中次郎',
                ],
            ],
            [
                'id' => 4,
                'title' => '人事異動申請',
                'status' => 'rejected',
                'createdAt' => '2025-10-26T16:45:00Z',
                'applicant' => [
                    'id' => 6,
                    'name' => '山本美咲',
                ],
            ],
        ];
    }
}
