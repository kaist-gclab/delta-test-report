#!/usr/bin/env bash

rm log.txt
touch log.txt

echo "이전 테스트에서 제거되지 않았을지도 모르는 잔여 파일 및 Docker 컨테이너를 모두 제거합니다." | tee -a log.txt
./down.sh

echo "데이터베이스 서버, 웹 서버 등 기본적으로 필요한 이미지를 다운로드합니다. 이 단계는 서버 구축 시간에 포함하지 않습니다."

docker pull ubuntu:20.04 &
docker pull node:14-alpine &
docker pull mcr.microsoft.com/dotnet/sdk:5.0-alpine &
docker pull mcr.microsoft.com/dotnet/runtime-deps:5.0-alpine &
docker pull postgres:13 &
docker pull minio/minio &
docker pull caddy:2-alpine &
wait

echo "서버 구축 시작 시각입니다. 지금부터 서버 구축 시간을 측정합니다." | tee -a log.txt
date | tee -a log.txt

echo "3차원 기하 모델 프로세싱 프레임워크를 다운로드합니다. 이 다운로드 단계는 서버 구축 시간에 포함합니다." | tee -a log.txt
./clone.sh

echo "3차원 기하 모델 프로세싱 프레임워크를 빌드합니다." | tee -a log.txt
./up.sh

DATABASE_INIT_DELAY="20"
echo "데이터베이스 서버 초기화 작업이 완료될 수 있도록 $DATABASE_INIT_DELAY 초 더 기다립니다." | tee -a log.txt
sleep $DATABASE_INIT_DELAY

echo "서버 구축 완료 시각입니다." | tee -a log.txt
date | tee -a log.txt

echo "자동 테스트를 시작합니다." | tee -a log.txt
./test.sh

echo "테스트 잔여 파일 및 Docker 컨테이너를 모두 제거합니다." | tee -a log.txt
./down.sh
