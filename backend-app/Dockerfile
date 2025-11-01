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

# Apache設定
RUN echo '<VirtualHost *:${PORT:-8080}>\n\
    ServerAdmin admin@approvalhub.local\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    <Directory /var/www/html/public>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        \n\
        # CORS設定\n\
        Header set Access-Control-Allow-Origin "*"\n\
        Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
        Header set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# ポート設定（Renderの動的ポート対応）
ENV PORT=8080
RUN sed -i "s/Listen 80/Listen \${PORT}/" /etc/apache2/ports.conf

EXPOSE ${PORT}

# Apache起動
CMD ["apache2-foreground"]
