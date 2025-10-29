<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Service;

/**
 * ファイルストレージサービス
 * AWS S3を使用してファイルを保存・取得
 */
class StorageService
{
    private string $bucket;
    private string $region;
    private string $accessKeyId;
    private string $secretAccessKey;

    public function __construct()
    {
        $this->bucket = getenv('AWS_S3_BUCKET') ?: '';
        $this->region = getenv('AWS_REGION') ?: 'ap-northeast-1';
        $this->accessKeyId = getenv('AWS_ACCESS_KEY_ID') ?: '';
        $this->secretAccessKey = getenv('AWS_SECRET_ACCESS_KEY') ?: '';
    }

    /**
     * ファイルをアップロード
     *
     * @param array<string, mixed> $file $_FILES からのファイル情報
     *
     * @return array{success: bool, url?: string, error?: string}
     */
    public function upload(array $file, string $path): array
    {
        // バリデーション
        if (! isset($file['tmp_name']) || ! is_uploaded_file($file['tmp_name'])) {
            return ['success' => false, 'error' => 'Invalid file'];
        }

        // ファイルサイズチェック (10MB)
        if ($file['size'] > 10 * 1024 * 1024) {
            return ['success' => false, 'error' => 'File too large (max 10MB)'];
        }

        // MIMEタイプチェック
        $allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (! in_array($file['type'], $allowedTypes, true)) {
            return ['success' => false, 'error' => 'Invalid file type'];
        }

        // ファイル名をサニタイズ
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('file_', true) . '.' . $extension;
        $key = trim($path, '/') . '/' . $filename;

        // 本番環境ではAWS SDK for PHPを使用
        // composer require aws/aws-sdk-php

        /*
        $s3Client = new \Aws\S3\S3Client([
            'version' => 'latest',
            'region'  => $this->region,
            'credentials' => [
                'key'    => $this->accessKeyId,
                'secret' => $this->secretAccessKey,
            ]
        ]);

        try {
            $result = $s3Client->putObject([
                'Bucket' => $this->bucket,
                'Key'    => $key,
                'SourceFile' => $file['tmp_name'],
                'ContentType' => $file['type'],
                'ACL'    => 'private',
            ]);

            return [
                'success' => true,
                'url' => $result['ObjectURL'],
                'key' => $key,
            ];
        } catch (\Aws\S3\Exception\S3Exception $e) {
            error_log('S3 Upload Error: ' . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
        */

        // デモ実装：ローカル保存
        $uploadDir = dirname(__DIR__, 2) . '/var/uploads/' . trim($path, '/');
        if (! is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $localPath = $uploadDir . '/' . $filename;
        if (move_uploaded_file($file['tmp_name'], $localPath)) {
            return [
                'success' => true,
                'url' => sprintf('/uploads/%s/%s', trim($path, '/'), $filename),
                'key' => $key,
                'size' => $file['size'],
                'type' => $file['type'],
            ];
        }

        return ['success' => false, 'error' => 'Failed to save file'];
    }

    /**
     * 署名付きURLを生成（一時的なダウンロード用）
     */
    public function getSignedUrl(string $key, int $expiresIn = 3600): string
    {
        // 本番環境ではS3の署名付きURLを生成
        /*
        $s3Client = new \Aws\S3\S3Client([...]);
        $cmd = $s3Client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key'    => $key
        ]);

        $request = $s3Client->createPresignedRequest($cmd, '+' . $expiresIn . ' seconds');
        return (string) $request->getUri();
        */

        // デモ実装
        return sprintf('/api/files/download/%s?expires=%d', urlencode($key), time() + $expiresIn);
    }

    /**
     * ファイルを削除
     */
    public function delete(string $key): bool
    {
        // 本番環境ではS3から削除
        /*
        $s3Client = new \Aws\S3\S3Client([...]);
        try {
            $s3Client->deleteObject([
                'Bucket' => $this->bucket,
                'Key'    => $key,
            ]);
            return true;
        } catch (\Aws\S3\Exception\S3Exception $e) {
            error_log('S3 Delete Error: ' . $e->getMessage());
            return false;
        }
        */

        // デモ実装：ローカルファイル削除
        $localPath = dirname(__DIR__, 2) . '/var/uploads/' . $key;
        if (file_exists($localPath)) {
            return unlink($localPath);
        }

        return false;
    }

    /**
     * ファイル情報を取得
     *
     * @return array{exists: bool, size?: int, contentType?: string}
     */
    public function getFileInfo(string $key): array
    {
        // 本番環境ではS3からメタデータを取得
        /*
        $s3Client = new \Aws\S3\S3Client([...]);
        try {
            $result = $s3Client->headObject([
                'Bucket' => $this->bucket,
                'Key'    => $key,
            ]);
            return [
                'exists' => true,
                'size' => $result['ContentLength'],
                'contentType' => $result['ContentType'],
            ];
        } catch (\Aws\S3\Exception\S3Exception $e) {
            return ['exists' => false];
        }
        */

        // デモ実装
        $localPath = dirname(__DIR__, 2) . '/var/uploads/' . $key;
        if (file_exists($localPath)) {
            return [
                'exists' => true,
                'size' => filesize($localPath),
                'contentType' => mime_content_type($localPath),
            ];
        }

        return ['exists' => false];
    }
}
