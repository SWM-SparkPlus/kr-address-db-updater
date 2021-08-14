#!/bin/bash

# 환경변수파일 읽어오기
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

target=$1

load_script="
SET GLOBAL local_infile = true;

LOAD DATA LOCAL INFILE '/tmp/resources/total/$target.txt'
INTO TABLE $target
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';
"

docker exec $(docker ps | grep mysql | awk '{ print $1 }') mysql --local-infile=1 -h$MYSQL_HOST -P$MYSQL_PORT -uroot -p$MYSQL_ROOT_PASSWORD -D$MYSQL_DATABASE -e "$load_script" >> ./logs/info/mysql_import.log