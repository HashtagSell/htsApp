#!/bin/sh
`ps -A | grep -q '[m]ongod'`

if [ "$?" -eq "0" ]; then
    echo "Stopping Mongo"
    mongo --eval "db.getSiblingDB('admin').shutdownServer()"
else
    echo "Mongo Not Running"
fi