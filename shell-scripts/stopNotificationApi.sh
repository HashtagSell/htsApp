#!/bin/sh
if lsof -Pi :4043 -sTCP:LISTEN -t >/dev/null ; then

    cd api/notification-svc
    echo "Stopping Notification API"
	kill -INT `lsof -t -i:4444`
else
    echo "Notification API Not Running"
fi