#!/usr/bin/env bash
source env.sh

(
    cd "$DIR/delta-server/config" &&
        rm -rf $DELTA_POSTGRES_DATA_DIRECTORY &&
        mkdir -p $DELTA_POSTGRES_DATA_DIRECTORY &&
        source ./postgres.sh
) &

(
    cd "$DIR/delta-object-storage" &&
        rm -rf $DELTA_OBJECT_STORAGE_DATA_DIRECTORY &&
        mkdir -p $DELTA_OBJECT_STORAGE_DATA_DIRECTORY &&
        source ./run.sh
) &

(
    cd "$DIR/delta-server/Delta" &&
        DELTA_SERVER_RUN_OPTIONS="-p $DELTA_SERVER_PORT:80 --link delta-object-storage --link delta-postgres"
    ./build.sh &&
        source ./remote.sh
) &

(
    cd "$DIR/delta-processor-null" && ./build.sh
) &

(
    cp "$DIR/env-web" "$DIR/delta-web/delta-web/.env" &&
        cd "$DIR/delta-web/delta-web" &&
        DELTA_WEB_RUN_OPTIONS="-p $DELTA_WEB_PORT:80"
    ./build.sh &&
        source remote.sh
) &

(
    RENDERER_BASE_IMAGE="kaistgclab/delta-renderer-base"
    docker rmi $RENDERER_BASE_IMAGE &&
        docker pull $RENDERER_BASE_IMAGE
) &

wait
