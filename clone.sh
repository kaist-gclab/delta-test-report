#!/usr/bin/env bash

# git clone --depth=1 https://github.com/kaist-gclab/delta-server
# git clone --depth=1 https://github.com/kaist-gclab/delta-object-storage
# git clone --depth=1 https://github.com/kaist-gclab/delta-processor-null
# git clone --depth=1 https://github.com/kaist-gclab/delta-web

rsync -r --exclude=node_modules --exclude=.git ../delta-server .
rsync -r --exclude=node_modules --exclude=.git ../delta-object-storage .
rsync -r --exclude=node_modules --exclude=.git ../delta-processor-null .
rsync -r --exclude=node_modules --exclude=.git ../delta-web .
