# Stage 1: Install composer dependencies
# Using a dedicated composer image is efficient
FROM composer:2 as vendor

WORKDIR /app
# Copy only the files needed to install dependencies
COPY database ./database
COPY composer.json composer.lock ./
# Install dependencies
RUN COMPOSER_PROCESS_TIMEOUT=2000 composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist


# Stage 2: Setup the final application image
# We use php:8.2 because your composer.json requires it
FROM php:8.2-fpm-alpine

# Set working directory inside the container
WORKDIR /var/www

# Install system packages needed by Laravel and common extensions
RUN apk --no-cache add \
    libzip-dev \
    zip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    git \
    curl

# Install the PHP extensions Laravel needs
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer from the official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the entire Laravel application source code
COPY . .

# Copy the pre-installed vendor folder from the first stage
COPY --from=vendor /app/vendor/ ./vendor/

# Set correct permissions for storage and bootstrap cache folders
# This allows the web server to write logs and cache files
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port 9000 to communicate with the Nginx web server
EXPOSE 9000

# The main command to run when the container starts
CMD ["php-fpm"]