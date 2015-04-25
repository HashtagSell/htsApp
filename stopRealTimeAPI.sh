#!/bin/sh
if lsof -Pi :4044 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Real-time Comm API"
	kill -INT `lsof -t -i:4044`
else
    echo "Real-time Comm API Not Running"
fi