#!/bin/sh
if lsof -Pi :4043 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Posting API"
	kill -INT `lsof -t -i:4043`
else
    echo "Posting API Not Running"
fi


if lsof -Pi :4044 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Real-time Comm API"
	kill -INT `lsof -t -i:4044`
else
    echo "Real-time Comm API Not Running"
fi


if lsof -Pi :8881 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Sync Agent"
	kill -INT `lsof -t -i:8881`
else
    echo "Sync Agent Not Running"
fi


if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping FreeGeoIP"
	kill -INT `lsof -t -i:8080`
else
    echo "FreeGeoIP Not Running"
fi



if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Redis"
	kill -INT `lsof -t -i:6379`
else
    echo "Redis Not Running"
fi


`ps -A | grep -q '[m]ongod'`

if [ "$?" -eq "0" ]; then
    echo "Stopping Mongo"
    mongo --eval "db.getSiblingDB('admin').shutdownServer()"
else
    echo "Mongo Not Running"
fi

