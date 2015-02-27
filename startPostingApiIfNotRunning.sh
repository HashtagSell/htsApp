#!/bin/sh
if lsof -Pi :4043 -sTCP:LISTEN -t >/dev/null ; then
    echo "Posting API already running"
else
    cd api/posting-api
    NODE_ENV=local npm start
fi