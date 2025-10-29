<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Auth;

use BEAR\Resource\ResourceObject;

class Logout extends ResourceObject
{
    public function onPost(): static
    {
        // 本番環境ではトークンをブラックリストに追加するなどの処理を行う
        // JWTの場合、クライアント側でトークンを削除すればOK

        $this->code = 200;
        $this->body = [
            'message' => 'ログアウトしました',
        ];

        return $this;
    }
}
