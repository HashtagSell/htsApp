#!/bin/sh
if lsof -Pi :8881 -sTCP:LISTEN -t >/dev/null ; then
    echo "Sync Agent already running"
else
    echo "Starting Sync Agent"
    cd api/posting-sync-agent
    NODE_ENV=local npm start
fi