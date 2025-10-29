<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Files;

use BEAR\Resource\ResourceObject;
use MyVendor\ApprovalHub\Service\StorageService;

class Upload extends ResourceObject
{
    public function __construct(
        private readonly StorageService $storage
    ) {
    }

    /**
     * POST /files/upload
     * ファイルをアップロード
     */
    public function onPost(): static
    {
        // ファイルが送信されているか確認
        if (empty($_FILES['file'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'NO_FILE',
                    'message' => 'ファイルが送信されていません',
                ],
            ];

            return $this;
        }

        $file = $_FILES['file'];

        // アップロード先のパスを決定
        // 本番環境では認証されたユーザーのテナントIDを使用
        $tenantId = 1; // デモ実装
        $path = sprintf('tenants/%d/attachments', $tenantId);

        // ファイルをアップロード
        $result = $this->storage->upload($file, $path);

        if (! $result['success']) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'UPLOAD_FAILED',
                    'message' => $result['error'] ?? 'アップロードに失敗しました',
                ],
            ];

            return $this;
        }

        $this->code = 201;
        $this->body = [
            'url' => $result['url'],
            'key' => $result['key'],
            'size' => $result['size'],
            'type' => $result['type'],
        ];

        return $this;
    }
}
