#!/usr/bin/env bash

./down.sh

echo "서버 구축 시작 시각입니다." | tee log.txt
date | tee log.txt

./clone.sh
./up.sh

echo "서버 구축 완료 시각입니다." | tee log.txt
date | tee log.txt

DATABASE_INIT_DELAY="20"
echo "데이터베이스 서버 초기화 작업이 완료될 수 있도록 더 기다립니다."
sleep $DATABASE_INIT_DELAY

./test.sh
./down.sh
