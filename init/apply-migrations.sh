#!/usr/bin/env bash

MONGO_HOST=$1;
MONGO_PORT=$2;

if [ -z $MONGO_HOST ]; then MONGO_HOST=localhost; fi;
if [ -z $MONGO_PORT ]; then MONGO_PORT=27017; fi;

for m in `ls ./init/data-migrations | sort`; do echo $m; mongo $MONGO_HOST:$MONGO_PORT/hts_app_db ./init/data-migrations/$m; done;