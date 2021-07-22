# DB Updater

이 저장소는 소프트웨어 마에스트로 제 12기 팀 Spark+의 도로명주소 DB를 구축하기 위한 DDL과 최신의 도로명 주소 DB를 유지하기 위한 업데이트를 담당하는 node.js 서버를 구현합니다.

## 아키텍처

<!-- !서버와 데이터베이스 모식도 넣을 것! -->

## 도로명주소 데이터베이스 테이블 관계도

![](statics/jusodb_relation.png)

출처: [도로명주소 개발자센터](https://www.juso.go.kr/addrlink/addressBuildDevNew.do?menu=match)

### 도로명코드 테이블

| 순번 | 컬럼명 | 크기 | 형식 | PK | 비고 |
| --- | --- | --- | --- | --- | --- |
| 1 | 도로명코드 | 12 | 문자 | PK1 | |
| 2 | 도로명 | 80 | 문자 | | |
| 3 | 도로명 로마자 | 80 | 문자 | | |
| 4 | 읍면동일련번호 | 2 | 문자 | PK2 | |
| 5 | 시도명 | 20 | 문자 | | |
| 6 | 시도명 로마자 | 40 | 문자 | | |
| 7 | 시군구명 | 20 | 문자 | | |
| 8 | 시군구명 로마자 | 40 | 문자 | | |
| 9 | 읍면동명 | 20 | 문자 | | |$%%%
| 10 | 읍면동명 로마자 | 40 | 문자 | | |
| 11 | 읍면동구분 | 1 | 문자 | | 0: 읍면, 1: 동, 2: 미부여 |
| 12 | 읍면동코드 | 3 | 문자 | | 법정동기준읍면동코드 |
| 13 | 사용여부 | 1 | 문자 | | 0: 사용, 1: 미사용 |
| 14 | 변경사유 | 1 | 문자 | | 0: 도로명변경, 1: 도로명폐지, 2: 시도시군구변경, 3: 읍면동변경, 4: 영문도로명변경, 9: 기타 |
| 15 | 변경이력정보 | 14 | 문자 | | 도로명코드(12) + 읍면동일련번호(2). 신규일 경우 "신규"로 표시 |
| 16 | 고시일자 | 8 | 문자 | | YYYYMMDD 형식 준수 |
| 17 | 말소일자 | 8 | 문자 | | YYYYMMDD 형식 준수 |

### 도로명주소 테이블

| 순번 | 컬럼명 | 크기 | 형식 | PK | 비고 |
| --- | --- | --- | --- | --- | --- |
| 1 | 관리번호 | 25 | 문자 | PK | |
| 2 | 도로명코드 | 12 | 문자 | | FK1 |
| 3 | 읍면동일련번호 | 2 | 문자 | | FK2 |
| 4 | 지하여부 | 1 | 문자 | | 0: 지상, 1: 지하 |
| 5 | 건물본번 | 5 | 숫자 | | |
| 6 | 건물부번 | 5 | 숫자 | | |
| 7 | 기초구역번호 | 5 | 문자 | | |
| 8 | 변경사유코드 | 2 | 문자 | | 31: 신규, 34: 변경, 63: 폐지 |
| 9 | 고시일자 | 8 | 문자 | | NULL |
| 10 | 변경전 도로명주소 | 25 | 문자 | | NULL |
| 11 | 상세주소 부여여부 | 1 | 문자 | | 0: 미부여, 1: 부여 |

### 지번주소 테이블

| 순번 | 컬럼명 | 크기 | 형식 | 비고 |
| --- | --- | --- | --- | --- |
| 1 | 관리번호 | 25 | 문자 | PK1, FK |
| 2 | 일련번호 | 3 | 숫자 | PK2 | 
| 3 | 법정동코드 | 10 | 문자 | |
| 4 | 시도명 | 20 | 문자 | |
| 5 | 시군구명 | 20 | 문자 | |
| 6 | 법정읍면동명 | 20 | 문자 | |
| 7 | 법정리명 | 20 | 문자 | |
| 8 | 산여부 | 1 | 문자 | 0: 대지, 1: 산 |
| 9 | 지번본번(번지) | 4 | 숫자 | |
| 10 | 지번부번(호) | 4 | 숫자 | |
| 11 | 대표여부 | 1 | 문자 | 0: 관련지번, 1: 대표지번 |

### 부가정보 테이블

| 순번 | 컬럼명 | 크기 | 형식 | PK | 비고 |
| --- | --- | --- | --- | --- | --- |
| 1 | 관리번호 | 25 | 문자 | PK | FK |
| 2 | 행정동코드 | 10 | 문자 |  | 참고용 |
| 3 | 행정동명 | 20 | 문자 | | 참고용 |
| 4 | 우편번호 | 5 | 문자 | | |
| 5 | 우편번호 일련번호 | 3 | 문자 | | |
| 6 | 다량배달처명 | 40 | 문자 | | |
| 7 | 건축물대장 건물명 | 40 | 문자 | | |
| 8 | 시군구 건물명 | 40 | 문자 | | |
| 9 | 공동주택여부 | 1 | 문자 | | 0: 비공동주택, 1: 공동주택 |

## 데이터베이스 업데이트 서버 라우팅 구조

<!-- 서버, 데이터베이스, 도로명주소 페이지 포함하는 아키텍처 필요 -->