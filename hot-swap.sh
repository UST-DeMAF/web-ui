#! /bin/bash

cd /app/web-ui && \
    echo "changed directory to /app/web-ui"

npm install -g npm@11.0.0 http-server && \
    echo "updated npm and installed http-server"

rm -rf node_modules && \
    echo "removed node_modules"
npm cache clean --force && \
    echo "cleaned npm cache"
npm ci && \
    echo "installed node_modules"

http-server dist -p 8079 & node server.cjs & \
    echo "started http-server and server.cjs"
npm run watch &
    echo "started watch"

tail -f /dev/null