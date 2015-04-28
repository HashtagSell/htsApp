#!/bin/sh
if lsof -Pi :4043 -sTCP:LISTEN -t >/dev/null ; then

    cd api/posting-api
    echo "Stopping Elasticserach"
    gulp es-stop

    echo "Stopping Posting API"
	kill -INT `lsof -t -i:4043`
else
    echo "Posting API Not Running"
fi