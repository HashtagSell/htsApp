#!/bin/sh
if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null ; then
    echo "Redis already running"
else
    redis-server
fi