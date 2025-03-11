#!/bin/sh

echo "{" > /app/dist/config.json

env | grep '^DEMAF_' | awk -F= '{print "  \""$1"\": \""$2"\","}' >> /app/dist/config.json
sed -i '$ s/,$//' /app/dist/config.json

echo "}" >> /app/dist/config.json

exec http-server dist -p 8079 & node server.cjs