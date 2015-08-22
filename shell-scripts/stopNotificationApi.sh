#!/bin/sh
if lsof -Pi :4444 -sTCP:LISTEN -t >/dev/null ; then

    cd api/notification-svc
    echo "Stopping Notification API"
	kill -INT `lsof -t -i:4444`
else
    echo "Notification API Not Running"
fi