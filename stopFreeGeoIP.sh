#!/bin/sh

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping FreeGeoIP"
	kill -INT `lsof -t -i:8080`
else
    echo "FreeGeoIP Not Running"
fi