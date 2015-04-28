#!/bin/sh
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "freeGeoIP already running"
else
    ./../../go/bin/freegeoip
fi