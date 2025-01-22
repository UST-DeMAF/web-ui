#! /bin/bash

cd /app/web-ui && \
    echo "changed directory to /app/web-ui"

npm install && \
    echo "installed node_modules"

npm run dev -- --host &

tail -f /dev/null