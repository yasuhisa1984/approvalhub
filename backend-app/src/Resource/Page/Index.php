<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\Page;

use BEAR\Resource\ResourceObject;

class Index extends ResourceObject
{
    /** @var array{message: string, version: string, status: string} */
    public $body;

    public function onGet(): static
    {
        $this->body = [
            'message' => 'ApprovalHub API is running',
            'version' => '1.0.0',
            'status' => 'healthy',
        ];

        return $this;
    }

    public function onHead(): static
    {
        // HEAD requests return no body
        return $this;
    }
}
