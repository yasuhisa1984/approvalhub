<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Router;

use BEAR\Sunday\Extension\Router\RouterInterface;
use BEAR\Sunday\Extension\Router\RouterMatch;

class ApiRouter implements RouterInterface
{
    /**
     * {@inheritdoc}
     */
    public function match(array $globals, array $server): RouterMatch
    {
        $method = $server['REQUEST_METHOD'] ?? 'GET';
        $path = $server['REQUEST_URI'] ?? '/';

        // Remove query string
        if (($pos = strpos($path, '?')) !== false) {
            $path = substr($path, 0, $pos);
        }

        // Parse query parameters
        parse_str($server['QUERY_STRING'] ?? '', $query);

        // Parse JSON body for POST/PUT/PATCH
        $body = [];
        if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
            $rawBody = file_get_contents('php://input');
            if ($rawBody !== false && $rawBody !== '') {
                $decoded = json_decode($rawBody, true);
                if (is_array($decoded)) {
                    $body = $decoded;
                }
            }
        }

        // Merge body into query for BEAR resources
        $query = array_merge($query, $body);

        // Determine resource URI with scheme
        if (str_starts_with($path, '/api/')) {
            // API routes -> app resources
            $apiPath = substr($path, 4); // Remove '/api' prefix
            $apiPath = trim($apiPath, '/');
            $resourceUri = 'app://self/' . $apiPath;
        } else {
            // Web routes -> page resources
            $pagePath = trim($path, '/');
            $resourceUri = 'page://self/' . $pagePath;
        }

        // Convert HTTP method to BEAR method
        $bearMethod = strtolower($method);

        return new RouterMatch(
            $resourceUri,
            $bearMethod,
            $query
        );
    }

    /**
     * {@inheritdoc}
     */
    public function generate($name, $data)
    {
        // Simple implementation for URL generation
        $query = http_build_query($data);

        return $name . ($query !== '' ? '?' . $query : '');
    }
}
