#!/bin/bash

# 환경변수파일 읽어오기
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

target=$1
reference_table=$2

create_index_script="
INSERT INTO $target (manage_number, tablename)
SELECT manage_number, (SELECT TABLE_NAME
                      FROM INFORMATION_SCHEMA.STATISTICS
                      WHERE TABLE_SCHEMA='$MYSQL_DATABASE'
                      AND TABLE_NAME='$reference_table')
FROM $reference_table
"

docker exec $(docker ps | grep mysql | awk '{ print $1 }') mysql -h$MYSQL_HOST -P$MYSQL_PORT -uroot -p$MYSQL_ROOT_PASSWORD -D$MYSQL_DATABASE -e "$create_index_script" >> ./logs/info/mysql_create_index.log