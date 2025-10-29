<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Service;

/**
 * メール送信サービス
 * SendGrid APIを使用してメールを送信
 */
class MailService
{
    private string $apiKey;
    private string $fromEmail;
    private string $fromName;

    public function __construct()
    {
        $this->apiKey = getenv('SENDGRID_API_KEY') ?: '';
        $this->fromEmail = getenv('SENDGRID_FROM_EMAIL') ?: 'noreply@approvalhub.com';
        $this->fromName = getenv('SENDGRID_FROM_NAME') ?: 'ApprovalHub';
    }

    /**
     * メールを送信
     *
     * @param array<string, mixed> $params
     */
    public function send(array $params): bool
    {
        // 本番環境ではSendGrid SDKを使用
        // composer require sendgrid/sendgrid

        /*
        $email = new \SendGrid\Mail\Mail();
        $email->setFrom($this->fromEmail, $this->fromName);
        $email->setSubject($params['subject']);
        $email->addTo($params['to'], $params['toName'] ?? '');
        $email->addContent("text/html", $params['html']);

        $sendgrid = new \SendGrid($this->apiKey);
        try {
            $response = $sendgrid->send($email);
            return $response->statusCode() === 202;
        } catch (\Exception $e) {
            error_log('SendGrid Error: ' . $e->getMessage());
            return false;
        }
        */

        // デモ実装：ログ出力
        error_log(sprintf(
            "📧 Mail sent: To=%s, Subject=%s",
            $params['to'] ?? '',
            $params['subject'] ?? ''
        ));

        return true;
    }

    /**
     * 招待メールを送信
     */
    public function sendInvitationEmail(string $email, string $inviteToken, string $tenantName): bool
    {
        $inviteUrl = sprintf(
            '%s/invite/accept?token=%s',
            getenv('FRONTEND_URL') ?: 'http://localhost:5173',
            $inviteToken
        );

        $html = $this->getInvitationTemplate($tenantName, $inviteUrl);

        return $this->send([
            'to' => $email,
            'subject' => "{$tenantName} への招待",
            'html' => $html,
        ]);
    }

    /**
     * 承認依頼メールを送信
     */
    public function sendApprovalRequestEmail(
        string $email,
        string $approverName,
        string $applicantName,
        string $title,
        int $approvalId
    ): bool {
        $approvalUrl = sprintf(
            '%s/approvals/%d',
            getenv('FRONTEND_URL') ?: 'http://localhost:5173',
            $approvalId
        );

        $html = $this->getApprovalRequestTemplate(
            $approverName,
            $applicantName,
            $title,
            $approvalUrl
        );

        return $this->send([
            'to' => $email,
            'subject' => "【承認依頼】{$title}",
            'html' => $html,
        ]);
    }

    /**
     * 承認完了メールを送信
     */
    public function sendApprovalCompletedEmail(
        string $email,
        string $applicantName,
        string $title
    ): bool {
        $html = $this->getApprovalCompletedTemplate($applicantName, $title);

        return $this->send([
            'to' => $email,
            'subject' => "【承認完了】{$title}",
            'html' => $html,
        ]);
    }

    /**
     * 却下通知メールを送信
     */
    public function sendApprovalRejectedEmail(
        string $email,
        string $applicantName,
        string $title,
        string $reason
    ): bool {
        $html = $this->getApprovalRejectedTemplate($applicantName, $title, $reason);

        return $this->send([
            'to' => $email,
            'subject' => "【却下】{$title}",
            'html' => $html,
        ]);
    }

    /**
     * ウェルカムメールを送信
     */
    public function sendWelcomeEmail(string $email, string $name, string $subdomain): bool
    {
        $loginUrl = sprintf(
            'https://%s.approvalhub.com',
            $subdomain
        );

        $html = $this->getWelcomeTemplate($name, $loginUrl);

        return $this->send([
            'to' => $email,
            'subject' => 'ApprovalHubへようこそ',
            'html' => $html,
        ]);
    }

    private function getInvitationTemplate(string $tenantName, string $inviteUrl): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>ApprovalHubへの招待</h2>
                <p><strong>{$tenantName}</strong> があなたをApprovalHubに招待しました。</p>
                <p>以下のボタンをクリックして、アカウントを作成してください。</p>
                <p><a href="{$inviteUrl}" class="button">招待を受ける</a></p>
                <p>このリンクは24時間有効です。</p>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getApprovalRequestTemplate(
        string $approverName,
        string $applicantName,
        string $title,
        string $approvalUrl
    ): string {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>承認依頼</h2>
                <p>{$approverName} 様</p>
                <p><strong>{$applicantName}</strong> さんから承認依頼が届いています。</p>
                <p><strong>件名:</strong> {$title}</p>
                <p><a href="{$approvalUrl}" class="button">詳細を確認</a></p>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getApprovalCompletedTemplate(string $applicantName, string $title): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>承認完了のお知らせ</h2>
                <p>{$applicantName} 様</p>
                <p>あなたの申請が承認されました。</p>
                <p><strong>件名:</strong> {$title}</p>
                <p>ご利用ありがとうございます。</p>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getApprovalRejectedTemplate(string $applicantName, string $title, string $reason): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>申請却下のお知らせ</h2>
                <p>{$applicantName} 様</p>
                <p>あなたの申請が却下されました。</p>
                <p><strong>件名:</strong> {$title}</p>
                <p><strong>却下理由:</strong> {$reason}</p>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getWelcomeTemplate(string $name, string $loginUrl): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>ApprovalHubへようこそ</h2>
                <p>{$name} 様</p>
                <p>アカウントの作成が完了しました。</p>
                <p>以下のボタンからログインしてください。</p>
                <p><a href="{$loginUrl}" class="button">ログイン</a></p>
                <p>ご利用ありがとうございます。</p>
            </div>
        </body>
        </html>
        HTML;
    }
}
