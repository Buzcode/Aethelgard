# Stage 1: Install composer dependencies
# Using a dedicated composer image is efficient
FROM composer:2 as vendor

WORKDIR /app
# Copy only the files needed to install dependencies from the 'backend' folder
COPY backend/database ./database
COPY backend/composer.json backend/composer.lock ./

# Install dependencies.
RUN composer install --ignore-platform-reqs --no-interaction --no-plugins --no-scripts --prefer-dist --no-dev


# Stage 2: Setup the final application image
# We use php:8.2-fpm-alpine as it's lightweight and what your composer.json requires
FROM php:8.2-fpm-alpine

# Set working directory inside the container
WORKDIR /var/www

# Install system packages needed by Laravel and common extensions
RUN apk add --no-cache \
    curl \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    oniguruma-dev \
    libxml2-dev

# Install the PHP extensions Laravel needs
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer from the official image (optional but good practice)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the entire Laravel application source code from the 'backend' directory
COPY backend/ .

# Copy the pre-installed vendor folder from the first stage
COPY --from=vendor /app/vendor/ ./vendor/

# Create the storage and cache directories that Laravel needs
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache

# Set correct permissions for storage and bootstrap cache folders
# This allows the web server to write logs and cache files
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port 9000 to communicate with the Nginx web server
EXPOSE 9000

# This command will run migrations first, then start the server
CMD php artisan migrate --force && php-fpm