#!/bin/sh
set -e
[ -z "$DOMAIN" -o -z "$EMAIL" ] && { echo 'Set DOMAIN and EMAIL'; exit 1; }
docker compose -f docker-compose.prod.yml run --rm -e DOMAIN=$DOMAIN -e EMAIL=$EMAIL -v /etc/letsencrypt:/etc/letsencrypt -v $(pwd)/proxy/html:/var/www/certbot certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --agree-tos --email $EMAIL --non-interactive
echo 'Certificate obtained'
