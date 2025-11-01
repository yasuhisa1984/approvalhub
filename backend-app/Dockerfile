# ApprovalHub Backend (BEAR.Sunday) Dockerfile
FROM php:8.2-apache

# システムパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Apacheモジュール有効化
RUN a2enmod rewrite headers

# 作業ディレクトリ
WORKDIR /var/www/html

# アプリケーションコードをコピー
COPY . .

# デバッグ情報を出力
RUN echo "=== PHP Version ===" && php -v
RUN echo "=== Composer Version ===" && composer --version
RUN echo "=== Current Directory ===" && pwd
RUN echo "=== Files in Directory ===" && ls -la

# vendorディレクトリを削除（クリーンインストールのため）
RUN rm -rf vendor || true

# Composer診断
RUN composer diagnose || echo "Composer diagnose failed"

# Composer依存関係をインストール（詳細ログ付き）
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev -vvv || \
    (echo "===== Composer install with --no-dev failed, trying without it =====" && \
     composer install --no-interaction --prefer-dist --optimize-autoloader -vvv)

# インストール結果を確認
RUN echo "=== Vendor Directory ===" && ls -la vendor/ || echo "Vendor directory not found"

# Composerオートロード最適化
RUN composer dump-autoload --optimize -vvv || echo "Autoload optimization skipped"

# 必要なディレクトリを作成
RUN mkdir -p var/tmp var/log var/tmp/cache var/tmp/di

# 権限設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/var/tmp \
    && chmod -R 777 /var/www/html/var/log

# public/index.phpが存在するか確認（なければ作成）
RUN if [ ! -f public/index.php ]; then \
    mkdir -p public && \
    echo '<?php\nphpinfo();\n' > public/index.php; \
    fi

# Apache設定
RUN echo '<VirtualHost *:80>\n\
    ServerAdmin admin@approvalhub.local\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    <Directory /var/www/html>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    <Directory /var/www/html/public>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        DirectoryIndex index.php\n\
        \n\
        # CORS設定\n\
        Header always set Access-Control-Allow-Origin "*"\n\
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
        \n\
        # Rewrite設定（BEAR.Sunday用）\n\
        <IfModule mod_rewrite.c>\n\
            RewriteEngine On\n\
            RewriteCond %{REQUEST_FILENAME} !-f\n\
            RewriteCond %{REQUEST_FILENAME} !-d\n\
            RewriteRule ^ index.php [QSA,L]\n\
        </IfModule>\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# ポート設定（Renderの動的ポート対応）
ENV PORT=8080

# Apache起動スクリプト
RUN echo '#!/bin/bash\n\
# ポート設定を動的に変更\n\
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf\n\
sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf\n\
\n\
# 環境変数を.envファイルに書き出し（BEAR.Sunday用）\n\
cat > /var/www/html/.env <<ENVEOF\n\
DATABASE_URL=${DATABASE_URL}\n\
JWT_SECRET=${JWT_SECRET}\n\
APP_ENV=${APP_ENV}\n\
APP_DEBUG=${APP_DEBUG}\n\
APP_URL=${APP_URL}\n\
FRONTEND_URL=${FRONTEND_URL}\n\
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}\n\
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}\n\
STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY:-}\n\
SENDGRID_API_KEY=${SENDGRID_API_KEY:-}\n\
SENDGRID_FROM_EMAIL=${SENDGRID_FROM_EMAIL:-}\n\
SENDGRID_FROM_NAME=${SENDGRID_FROM_NAME:-}\n\
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-}\n\
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-}\n\
AWS_REGION=${AWS_REGION:-ap-northeast-1}\n\
AWS_S3_BUCKET=${AWS_S3_BUCKET:-}\n\
ENVEOF\n\
\n\
exec apache2-foreground\n\
' > /start.sh && chmod +x /start.sh

EXPOSE ${PORT}

# Apache起動
CMD ["/start.sh"]
