#!/bin/sh

echo "Installing PHP extensions"
docker-php-ext-install pdo_mysql

# Install Phalcon
DRIVER_VERSION=1.10.0
PHPLIB_VERSION=1.8.0

set -xe && \
    apk --update add --virtual build-dependencies build-base openssl-dev autoconf \
    && pecl install "mongodb-${DRIVER_VERSION}"\
    && docker-php-ext-enable mongodb \
    && apk del build-dependencies build-base openssl-dev autoconf \
    && rm -rf /var/cache/apk/*
