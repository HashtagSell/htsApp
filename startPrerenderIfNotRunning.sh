#!/bin/sh
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Prerender dev server already running"
else
    cd node_modules/prerender
    node server.js
fi