#!/usr/bin/env bash
source env.sh

CONTAINER_NAMES="delta-app-server delta-object-storage delta-postgres delta-web"
docker stop $CONTAINER_NAMES
docker rm $CONTAINER_NAMES

rm -rf "$TEMP/test-object-storage-data"
rm -rf "$TEMP/postgres-test"

rm -rf ./delta-server/ ./delta-object-storage/ ./delta-processor-null/ ./delta-web/
