<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Module;

use BEAR\Sunday\Extension\Router\RouterInterface;
use MyVendor\ApprovalHub\Router\ApiRouter;
use Ray\Di\AbstractModule;

class ApiRouterModule extends AbstractModule
{
    protected function configure(): void
    {
        $this->bind(RouterInterface::class)->to(ApiRouter::class)->in('Singleton');
    }
}
