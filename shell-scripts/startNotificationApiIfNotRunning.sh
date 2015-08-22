#!/bin/sh
if lsof -Pi :4444 -sTCP:LISTEN -t >/dev/null ; then
    echo "Notification API already running"
else
    cd api/notification-svc
    NODE_ENV=local npm start
fi