#!/bin/bash

# 환경변수파일 읽어오기
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

sido=$1

echo "[Shell] Start building table with $sido"

sql="
REPLACE INTO integrated_address_$sido
(SELECT sub.manage_number, sub.roadname_code, sub.zipcode, sub.sido, sub.sigungu, 
		sub.eupmyeondong, sub.bupjungli, code.roadname, sub.is_basement,
		sub.building_primary_number, sub.building_secondary_number, sub.bupjungdong_code
FROM 	roadname_code code, (
		SELECT juso.manage_number, juso.roadname_code, juso.is_basement, juso.building_primary_number, juso.building_secondary_number, juso.basic_state_number as zipcode,
				jibun.bupjungdong_code, jibun.sido, jibun.sigungu, jibun.bupjungeupmyeondong as eupmyeondong, jibun.bupjungli, juso.eupmyeondong_serial_number
		FROM roadname_address_$sido juso, jibun_address_$sido jibun
		WHERE juso.manage_number = jibun.manage_number LIMIT 5) sub
WHERE code.roadname_code = sub.roadname_code AND code.eupmyeondong_serial_number = sub.eupmyeondong_serial_number);
"
echo $sql

docker exec $(docker ps | grep mysql | awk '{ print $1 }') \
mysql -h$MYSQL_HOST -P$MYSQL_PORT -uroot -p$MYSQL_ROOT_PASSWORD -D$MYSQL_DATABASE \
-e "$sql"