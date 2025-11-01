<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Module;

use BEAR\Dotenv\Dotenv;
use BEAR\Package\AbstractAppModule;
use BEAR\Package\PackageModule;
use MyVendor\ApprovalHub\Service\StorageService;
use MyVendor\ApprovalHub\Service\MailService;

use function dirname;

class AppModule extends AbstractAppModule
{
    protected function configure(): void
    {
        (new Dotenv())->load(dirname(__DIR__, 2));

        // サービスをバインド
        $this->bind(StorageService::class);
        $this->bind(MailService::class);

        $this->install(new ApiRouterModule());
        $this->install(new PackageModule());
    }
}
