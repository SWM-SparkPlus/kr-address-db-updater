#!/bin/bash

# 환경변수파일 읽어오기
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

load_script="
SET GLOBAL local_infile = true;

LOAD DATA LOCAL INFILE '/tmp/resources/total/roadname_code_total.txt'
INTO TABLE roadname_code
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';
"

docker exec -it $(docker ps | grep mysql | awk '{ print $1 }') mysql --local-infile=1 -uroot -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE -e "$load_script"