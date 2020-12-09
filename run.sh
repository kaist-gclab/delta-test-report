#!/usr/bin/env bash

./down.sh
./clone.sh
./up.sh

DATABASE_INIT_DELAY="20"
echo "데이터베이스 서버 초기화 작업이 완료될 수 있도록 더 기다립니다."
sleep $DATABASE_INIT_DELAY

./test.sh
./down.sh
