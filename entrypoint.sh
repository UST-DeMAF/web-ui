#!/bin/sh

for var in $(env | grep '^DEMAF_' | cut -d= -f1); do
  value=$(eval echo \$$var)
  cleaned=$(echo "$value" | sed -E 's|https?://||')
  export "$var=$cleaned"
done

echo "{" > /app/dist/config.json
env | grep '^DEMAF_' | awk -F= '{print "  \""$1"\": \""$2"\","}' >> /app/dist/config.json
sed -i '$ s/,$//' /app/dist/config.json
echo "}" >> /app/dist/config.json

envsubst "$(env | grep '^DEMAF_' | cut -d= -f1 | sed 's/^/${/;s/$/}/' | tr '\n' ' ')" < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

echo "*/5 * * * * node /app/cleanup.js >> /var/log/cleanup.log 2>&1" > /etc/cron.d/cleanup
crontab /etc/cron.d/cleanup
crond

tail -F /var/log/cleanup.log &
node server.js &
nginx -g "daemon off;"