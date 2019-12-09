#!/usr/bin/env bash
export DIR=${PWD}
export TEMP="$DIR/temp"

export DELTA_OBJECT_STORAGE_ACCESS_KEY="TEST_DELTA_OBJECT_STORAGE_ACCESS_KEY"
export DELTA_OBJECT_STORAGE_SECRET_KEY="TEST_DELTA_OBJECT_STORAGE_SECRET_KEY"
export DELTA_OBJECT_STORAGE_DATA_DIRECTORY="$TEMP/test-object-storage-data"

export DELTA_POSTGRES_PORT="35432"
export DELTA_POSTGRES_PASSWORD="TEST_DELTA_POSTGRES_PASSWORD"
export DELTA_POSTGRES_USER="DELTA_TEST"
export DELTA_POSTGRES_DB="DELTA_TEST"
export DELTA_POSTGRES_DATA_DIRECTORY="$TEMP/postgres-test"
export DELTA_POSTGRES_INITDB="$DIR/initdb"

export DELTA_JWT_SECRET="TEST_DELTA_JWT_SECERT"
export DELTA_AUTH_ADMIN_PASSWORD="TEST_DELTA_ADMIN_PASSWORD"
export DELTA_CONNECTION_STRING_DATABASE="Host=delta-postgres;Port=5432;Database=DELTA_TEST;Search Path=public;Username=DELTA_TEST;Password=TEST_DELTA_POSTGRES_PASSWORD;Maximum Pool Size=10;"
export DELTA_OBJECT_STORAGE_ENDPOINT="delta-object-storage:9000"
export DELTA_SERVER_PORT="18080"

./clone.sh
./up.sh

DATABASE_INIT_DELAY="10"
echo "데이터베이스 서버 초기화 작업이 완료될 수 있도록 더 기다립니다."
sleep $DATABASE_INIT_DELAY

./test.sh
