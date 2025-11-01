# ApprovalHub Backend Dockerfile
# BEAR.Sunday PHP Application

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

# Apacheの設定
RUN a2enmod rewrite headers

# 作業ディレクトリ
WORKDIR /var/www/html

# 依存関係ファイルをコピー
COPY composer.json composer.lock* ./

# Composer依存関係をインストール
RUN composer install --no-dev --optimize-autoloader --no-scripts || true

# アプリケーションコードをコピー
COPY . .

# Composerスクリプト実行
RUN composer dump-autoload --optimize || true

# 権限設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Apache設定ファイル
RUN echo '<VirtualHost *:${PORT:-8080}>\n\
    ServerAdmin admin@approvalhub.local\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# ポート設定（Renderは動的ポートを使用）
ENV PORT=8080
RUN sed -i "s/Listen 80/Listen \${PORT}/" /etc/apache2/ports.conf

# ヘルスチェック用エンドポイント
RUN echo '<?php\nheader("Content-Type: application/json");\necho json_encode(["status" => "ok", "timestamp" => date("c")]);\n' > /var/www/html/public/health.php

EXPOSE ${PORT}

# Apache起動
CMD ["apache2-foreground"]
