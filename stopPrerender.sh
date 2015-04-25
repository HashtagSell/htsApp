#!/bin/sh
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Prerender Dev Server"
	kill -INT `lsof -t -i:3000`
else
    echo "Prerender Dev Server Not Running"
fi