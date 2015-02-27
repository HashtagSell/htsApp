#!/bin/sh
# this script checks if the mongod is running, starts it if not

`ps -A | grep -q '[m]ongod'`

if [ "$?" -eq "0" ]; then
    echo "Mongo already running"
else
    mongod -dbpath ~/data/db/
fi