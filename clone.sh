#!/usr/bin/env bash

if [ "$DELTA_TEST_MODE" = "LOCAL" ]; then
    rsync -r --exclude=node_modules --exclude=.git ../delta-server .
    rsync -r --exclude=node_modules --exclude=.git ../delta-object-storage .
    rsync -r --exclude=node_modules --exclude=.git ../delta-processor-null .
    rsync -r --exclude=node_modules --exclude=.git ../delta-web .
    rsync -r --exclude=node_modules --exclude=.git ../delta-renderer .
else
    git clone --depth=1 https://github.com/kaist-gclab/delta-server
    git clone --depth=1 https://github.com/kaist-gclab/delta-object-storage
    git clone --depth=1 https://github.com/kaist-gclab/delta-processor-null
    git clone --depth=1 https://github.com/kaist-gclab/delta-web
    git clone --depth=1 https://github.com/kaist-gclab/delta-renderer
fi

cd ./delta-renderer/delta-renderer-base/ && ./build.sh
