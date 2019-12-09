#!/usr/bin/env bash

CONTAINER_NAMES="delta-app-server delta-object-storage delta-postgres" 
sudo docker stop $CONTAINER_NAMES
sudo docker rm $CONTAINER_NAMES

cd "$DIR/delta-server/config" && \
    rm -rf $DELTA_POSTGRES_DATA_DIRECTORY && \
    source ./postgres.sh

cd "$DIR/delta-object-storage" && \
    rm -rf $DELTA_OBJECT_STORAGE_DATA_DIRECTORY && \
    source ./run.sh

cd "$DIR/delta-server/Delta" && \
    DELTA_SERVER_RUN_OPTIONS="-p $DELTA_SERVER_PORT:80 --link delta-object-storage --link delta-postgres"
    ./build.sh && \
    docker save --output docker-image.tar delta-app-server && \
    source ./remote.sh

cd "$DIR/delta-processor-null" && ./build.sh
