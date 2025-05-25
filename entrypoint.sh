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

envsubst '${CRON_SCHEDULE}' < /app/cronjob.template > /app/cronjob
crontab /app/cronjob
crond -f &

node server.js &
nginx -g "daemon off;"