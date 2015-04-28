#!/bin/sh
if lsof -Pi :4043 -sTCP:LISTEN -t >/dev/null ; then
    echo "Posting API already running"
else
    cd api/posting-api
    gulp es-start
    NODE_ENV=local npm run sync-es
    NODE_ENV=local npm start
fi