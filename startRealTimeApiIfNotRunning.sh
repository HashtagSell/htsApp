#!/bin/sh
if lsof -Pi :4044 -sTCP:LISTEN -t >/dev/null ; then
    echo "Real-time Comm API already running"
else
    cd api/realtime-svc
    NODE_ENV=local npm start
fi