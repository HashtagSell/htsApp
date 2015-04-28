#!/bin/sh
if lsof -Pi :8881 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Sync Agent"
	kill -INT `lsof -t -i:8881`
else
    echo "Sync Agent Not Running"
fi