#!/usr/bin/env bash

CONTAINER_NAMES="delta-app-server delta-object-storage delta-postgres" 
docker stop $CONTAINER_NAMES
docker rm $CONTAINER_NAMES
