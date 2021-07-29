-- 다운받은 데이터베이스 파일을 데이터베이스에 가져오기 위한 SQL

-- 도로명주소 코드
LOAD DATA LOCAL INFILE '/tmp/resources/total/roadname_code_total.txt'
INTO TABLE roadname_code
FIELDS TERMINATED BY '|'
LINES TERMINATED BY '\n';

