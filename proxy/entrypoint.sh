#!/bin/sh
set -e
envsubst '$DOMAIN' < /etc/nginx/nginx.tmpl > /etc/nginx/nginx.conf
nginx -g 'daemon off;'
