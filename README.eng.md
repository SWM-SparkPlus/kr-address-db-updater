# db-updater

This is a batch program package to easy-to-build integrated Korean addressing system database for [Spark+ project.](https://github.com/SWM-SparkPlus/spark-plugin)

Since 2014, Korea uses two different addressing system, `Jibun(지번)` and `Roadname(도로명)`. These have a problem with data unification.(or mapping) If you're a working with data set based on Korea addressing system like address search, data engineering, you should map the data on one side.

This program depends on [Node.js](https://nodejs.org/en/download/), [Docker](https://docs.docker.com/get-docker/), and [docker-compose](https://docs.docker.com/compose/install/). If you don't have these, you cannot run this process.

## Terms of Korean addressing system

Korea addressing system is a traditional hierarchy addressing system, area named with Sido(시도) - Sigungu(시군구) - Eupmyeondong(읍면동)
.

- Sido(시도): Top level administrative division. This is designated by law. There's 17 Sidoes in South Korea.
- Sigungu(시군구): Lower level of Sido. This can be split into Si(시), Gun(군), 구(Gu), also has hierarchy order. This is designated by law.
- Eupmyeondong(읍면동): Lower level of Sigungu. This can be split into Eup(읍), Myeon(면), Dong(동), also has hierarchy order. This is designated by law.
- Hangjung-(행정-): A prefix that stands for administrative. If a term(area) has this prefix, area could split to several area or merged with neighbor area for ease-of-governance reason. SparkPlus/db-updater contains Hangjungdong(행정동) data.
- Hangjung-(법정-): A prefix that stands for designated by law. SparkPlus/db-updater contains Bupjungdong(법정동) data.

## Feature

1. The first Korean addressing system database build automation
2. **Build database within 5 mins** on x86_64 arch UNIX (Tested with i5 10210U, without integrated table for Spark+ system)
3. Spend 10 seconds for daily data updates(with 2K ~ 3K rows)
4. Spend 1 minute for accumulation data updates(15 days accumulation data updates)

## Quick start

```s
###
# 1. Clone repository
###

$ git clone https://github.com/SWM-SparkPlus/db-updater.git
$ cd db-updater

###
# 2. Setup envs
###

# This example uses DATABASE_URL, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD in `.env`

$ cat .env.example > .env

###
# 3. Install dependencies
###

$ npm install

###
# 4. Run database file download - create - import - update script
###

$ npm run setup:all

###
# Option 1. Create table for Spark+ plugin
###

$ npm run setup:integrated:address

## Table schemas

### Roadname codes

Tablename: roadname_code

| Order | Column Name(Korean) | Real Column Name           | Length | Data Format | PK  | Etc                                                                                                                               |
| ----- | ------------------- | -------------------------- | ------ | ----------- | --- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1     | 도로명코드          | roadname_code              | 12     | String      | PK1 | Bupjungsido_code(2) + Bupjungsigungu_code(3) + Roadname_number(7)                                                                 |
| 2     | 도로명              | roadname                   | 80     | String      |     |                                                                                                                                   |
| 3     | 도로명 로마자       | roadname_eng               | 80     | String      |     |                                                                                                                                   |
| 4     | 읍면동일련번호      | eupmyeondong_serial_number | 2      | String      | PK2 |                                                                                                                                   |
| 5     | 시도명              | sido                       | 20     | String      |     |                                                                                                                                   |
| 6     | 시도명 로마자       | sido_eng                   | 40     | String      |     |                                                                                                                                   |
| 7     | 시군구명            | sigungu                    | 20     | String      |     |                                                                                                                                   |
| 8     | 시군구명 로마자     | sigungu_eng                | 40     | String      |     |                                                                                                                                   |
| 9     | 읍면동명            | eupmyeondong               | 20     | String      |     |                                                                                                                                   |
| 10    | 읍면동명 로마자     | eupmyeondong_eng           | 40     | String      |     |                                                                                                                                   |
| 11    | 읍면동구분          | eupmyeondong_type          | 1      | String      |     | 0: eupmyeon, 1: dong, 2: not assigned                                                                                             |
| 12    | 읍면동코드          | eupmyeondong_code          | 3      | String      |     | Eupmyeondong_code by Bupjungdong                                                                                                  |
| 13    | 사용여부            | is_using                   | 1      | String      |     | 0: using, 1: not using                                                                                                            |
| 14    | 변경사유            | change_reason              | 1      | String      |     | 0: Roadname changed, 1: Roadname abolition, 2: Sido/Sigungu changed, 3: Eupmyeondong changed, 4: English roadname changed, 9: etc |
| 15    | 변경이력정보        | change_history             | 14     | String      |     | roadname_code(12) + eupmyeondong_serial_number(2). If "new", this value is "신규"                                                 |
| 16    | 고시일자            | declare_date               | 8      | String      |     | YYYYMMDD Format                                                                                                                   |
| 17    | 말소일자            | expire_date                | 8      | String      |     | YYYYMMDD Format                                                                                                                   |

### Roadname address table

Tablename: roadname_address_SIDO

| Order | Column Name(Korean) | Real Column Name           | Length | Data Format | PK  | Etc                                                                                                            |
| ----- | ------------------- | -------------------------- | ------ | ----------- | --- | -------------------------------------------------------------------------------------------------------------- |
| 1     | 관리번호            | manage_number              | 25     | String      | PK  | Bupjungdong_code(10) + is_mountain(1) + Jibun_primary_number(4) + Jibun_secondary_number(4) + System_number(6) |
| 2     | 도로명코드          | roadname_code              | 12     | String      |     | FK1, Bupjungsido_code(2) + Bupjungsigungu_code(3) + Roadname_number(7)                                         |
| 3     | 읍면동일련번호      | eupmyeondong_serial_number | 2      | String      |     | FK2                                                                                                            |
| 4     | 지하여부            | is_basement                | 1      | String      |     | 0: Ground, 1: Basement                                                                                         |
| 5     | 건물본번            | building_primary_number    | 5      | Number      |     |                                                                                                                |
| 6     | 건물부번            | building_secondary_number  | 5      | Number      |     |                                                                                                                |
| 7     | 기초구역번호        | basic_state_number         | 5      | String      |     |                                                                                                                |
| 8     | 변경사유코드        | change_reason_code         | 2      | String      |     | Only on daily/monthly data. 31: New, 34: Changed, 63: Abolished                                                |
| 9     | 고시일자            | notice_date                | 8      | String      |     | NULL                                                                                                           |
| 10    | 변경전 도로명주소   | previous_roadname_address  | 25     | String      |     | NULL                                                                                                           |
| 11    | 상세주소 부여여부   | has_detail                 | 1      | String      |     | 0: Don't have, 1: Have                                                                                         |

### Jibun address table

Tablename: jibun_address_SIDO

| Order | Column Name(Korean) | Real Column Name       | Length | Data Format | Etc                                                                                                                     |
| ----- | ------------------- | ---------------------- | ------ | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1     | 관리번호            | manage_number          | 25     | String      | PK1, FK, Bupjungdong_code(10) + is_mountain(1) + Jibun_primary_number(4) + Jibun_secondary_number(4) + System_number(6) |
| 2     | 일련번호            | serial_number          | 3      | Number      | PK2                                                                                                                     |
| 3     | 법정동코드          | bupjungdong_code       | 10     | String      | Bupjungsido_code(2) + Bupjungsigungu_code(3) + Roadname_number(7) + 00                                                  |
| 4     | 시도명              | sido                   | 20     | String      |                                                                                                                         |
| 5     | 시군구명            | sigungu                | 20     | String      |                                                                                                                         |
| 6     | 법정읍면동명        | bupjungeupmyeondong    | 20     | String      |                                                                                                                         |
| 7     | 법정리명            | bupjungli              | 20     | String      |                                                                                                                         |
| 8     | 산여부              | is_mountain            | 1      | String      | 0: Ground, 1: Mountain                                                                                                  |
| 9     | 지번본번(번지)      | jibun_primary_number   | 4      | Number      |                                                                                                                         |
| 10    | 지번부번(호)        | jibun_secondary_number | 4      | Number      |                                                                                                                         |
| 11    | 대표여부            | is_representation      | 1      | String      | 0: Related_jibun, 1: Representative_jibun                                                                               |
| 12    | 변경사유코드        | change_reason_code     | 2      | String      | Only on daily/monthly data. 31: New, 34: Changed, 63: Abolished                                                         |

### Additional table

Tablename: additional_info_SIDO

| Order | Column Name(Korean) | Real Column Name            | Length | Data Format | PK  | Etc                  |
| ----- | ------------------- | --------------------------- | ------ | ----------- | --- | -------------------- |
| 1     | 관리번호            | manage_number               | 25     | String      | PK  | FK                   |
| 2     | 행정동코드          | hangjungdong_code           | 10     | String      |     |                      |
| 3     | 행정동명            | hangjungdong                | 20     | String      |     |                      |
| 4     | 우편번호            | zipcode                     | 5      | String      |     |                      |
| 5     | 우편번호 일련번호   | zipcode_serial_number       | 3      | String      |     |                      |
| 6     | 다량배달처명        | bulk_delivery_building_name | 40     | String      |     |                      |
| 7     | 건축물대장 건물명   | master_building_name        | 40     | String      |     |                      |
| 8     | 시군구 건물명       | sigungu_building_name       | 40     | String      |     |                      |
| 9     | 공동주택여부        | is_apt                      | 1      | String      |     | 0: Not a apt, 1: Apt |

### Integrated table for Spark+ plugin

Tablename: integrated_address_SIDO

Table for Spark+ plugin used for zipcode mapping, area mapping, address search.

| Order | Column Name(Korean) | Real Column Name          | Length | Data Format | PK  | Etc                                                                                                             |
| ----- | ------------------- | ------------------------- | ------ | ----------- | --- | --------------------------------------------------------------------------------------------------------------- |
| 1     | 관리번호            | manage_number             | 25     | String      | PK  | FK                                                                                                              |
| 2     | 도로명코드          | roadname_code             | 12     | String      |     | Referenced roadname_address table. 참고용                                                                       |
| 3     | 우편번호            | zipcode                   | 5      | String      |     | Referenced roadname_address table.(zipcode is same as basic_state_number) Use for mapping zipcode               |
| 4     | 시도명              | sido                      | 20     | String      |     | Referenced roadname_code table. Use for generate roadname_address.                                              |
| 5     | 시군구명            | sigungu                   | 20     | String      |     | Referenced roadname_code table. Use for generate roadname_address.                                              |
| 6     | 읍면동명            | eupmyeondong              | 20     | String      |     | Referenced roadname_code table.(eupmyeondong is same as bupjungeupmyeondong) Use for generate roadname_address. |
| 7     | 법정리명            | bupjungli                 | 20     | String      |     | Referenced jibun_address table. Use for generate roadname_address.                                              |
| 8     | 도로명              | roadname                  | 80     | String      |     | Referenced roadname_code table. Use for generate roadname_address.                                              |
| 9     | 지하여부            | is_basement               | 1      | String      |     | Referenced roadname_address table. Use for generate roadname_address.                                           |
| 10    | 건물본번            | building_primary_number   | 5      | Number      |     | Referenced roadname_address table. Use for generate roadname_address.                                           |
| 11    | 건물부번            | building_secondary_number | 5      | Number      |     | Referenced roadname_address table. Use for generate roadname_address.                                           |
| 12    | 법정동코드          | bupjungdong_code          | 10     | String      |     | Referenced jibun_address table. Use for generate roadname_address.                                              |

## LICENCE

[MIT](https://github.com/SWM-SparkPlus/db-updater/blob/master/LICENSE)
```
