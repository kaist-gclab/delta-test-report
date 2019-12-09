#!/usr/bin/env bash

CONTAINER_NAMES="delta-app-server delta-object-storage delta-postgres" 
sudo docker stop $CONTAINER_NAMES
sudo docker rm $CONTAINER_NAMES
