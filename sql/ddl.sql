-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema sparkplus
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sparkplus
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sparkplus` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema sparkplus
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sparkplus
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sparkplus` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `sparkplus` ;

-- -----------------------------------------------------
-- Table `sparkplus`.`roadname_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`roadname_address` (
  `manage_number` VARCHAR(25) NOT NULL COMMENT '관리번호. PK.',
  `roadname_code` VARCHAR(12) NOT NULL COMMENT '도로명코드',
  `eupmyeondong_number` VARCHAR(2) NOT NULL COMMENT '읍면동일련번호',
  `basement` VARCHAR(1) NULL COMMENT '지하여부. 0: 지상, 1: 지하',
  `building_primary_number` SMALLINT(5) NULL COMMENT '건물본번',
  `building_secondary_number` SMALLINT(5) NULL COMMENT '건물부번',
  `basic_area_number` VARCHAR(5) NULL COMMENT '기초구역번호',
  `change_reason_code` VARCHAR(2) NULL COMMENT '변경사유코드',
  `notice_date` VARCHAR(8) NULL COMMENT '고시일자',
  `previous_roadname_address` VARCHAR(25) NULL COMMENT '변경전도로명주소',
  `has_detail` VARCHAR(1) NULL COMMENT '상세주소부여여부. 0: 미부여, 1: 부여',
  PRIMARY KEY (`manage_number`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '도로명주소 테이블';


-- -----------------------------------------------------
-- Table `sparkplus`.`jibun_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`jibun_address` (
  `manage_number` VARCHAR(25) NOT NULL COMMENT '관리번호. PK1. FK.',
  `serial_number` SMALLINT(3) NOT NULL COMMENT '일련번호. PK2.',
  `bupjungdong_code` VARCHAR(10) CHARACTER SET 'utf8mb4' NULL COMMENT '법정동코드',
  `sido_name` VARCHAR(20) NULL COMMENT '시도명',
  `sigungu_name` VARCHAR(20) NULL COMMENT '시군구명',
  `bupjung_eupmyeondong_name` VARCHAR(20) NULL COMMENT '법정읍면동명',
  `bupjunglee_name` VARCHAR(20) NULL COMMENT '법정리명',
  `is_mountain` VARCHAR(1) NULL COMMENT '산 여부. 1일 때 산',
  `jibun_primary` SMALLINT(4) NULL COMMENT '지번본번(번지)',
  `jibun_secondary` SMALLINT(4) NULL COMMENT '지번부번(호)',
  `is_representation` VARCHAR(1) NULL COMMENT '대표여부. 0: 관련지번, 1: 대표지번',
  PRIMARY KEY (`manage_number`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '지번주소 테이블';


-- -----------------------------------------------------
-- Table `sparkplus`.`roadname_code`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`roadname_code` (
  `roadname_code` VARCHAR(12) NOT NULL COMMENT '도로명주소 코드. PK1',
  `roadname` VARCHAR(80) NOT NULL COMMENT '도로명',
  `roadname_eng` VARCHAR(80) NULL COMMENT '도로명 로마자',
  `eupmyeondong_number` VARCHAR(2) NOT NULL COMMENT '읍면동일련번호. PK2',
  `sido_name` VARCHAR(20) NULL COMMENT '시도명',
  `sido_eng` VARCHAR(40) NULL COMMENT '시도명 로마자',
  `sigungu` VARCHAR(20) NULL COMMENT '시군구명',
  `sigungu_eng` VARCHAR(40) NULL COMMENT '시군구명 로마자',
  `eupmyeondong` VARCHAR(20) NULL COMMENT '읍면동명',
  `eupmyeondong_eng` VARCHAR(40) NULL COMMENT '읍면동명 로마자',
  `eupmyeondong_type` VARCHAR(1) NULL COMMENT '읍면동구분. 0: 읍면, 1: 동, 2: 미부여',
  `eupmyeondong_code` VARCHAR(3) NULL COMMENT '읍면동코드. 법정동 기준 읍면동 코드',
  `is_using` VARCHAR(1) NULL COMMENT '사용여부. 1일때 사용',
  `change_reason` VARCHAR(1) NULL COMMENT '변경사유. 0: 도로명 변경, 1: 도로명 폐지, 2: 시도시군구변경, 3: 읍면동변경, 4: 영문도로명변경, 9: 기타',
  `change_history` VARCHAR(14) NULL COMMENT '변경이력정보. 도로명코드(12) + 읍면동일련번호(2). 신규일경우 \"신규\"로 표시',
  `declare_date` VARCHAR(8) NULL COMMENT '고시일자',
  `expire_date` VARCHAR(8) NULL COMMENT '말소일자')
ENGINE = InnoDB
COMMENT = '도로명 테이블';


-- -----------------------------------------------------
-- Table `sparkplus`.`additional_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`additional_info` (
  `manage_number` VARCHAR(25) NOT NULL,
  `hangjungdong_code` VARCHAR(10) NULL,
  `hangjungdong_name` VARCHAR(20) NULL,
  `zipcode` VARCHAR(5) NULL,
  `zipcode_serial_number` VARCHAR(3) NULL,
  `bulk_delivery_building_name` VARCHAR(40) NULL,
  `master_building_name` VARCHAR(40) NULL,
  `sigungu_building_name` VARCHAR(40) NULL,
  `is_apt` VARCHAR(1) NULL,
  PRIMARY KEY (`manage_number`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

USE `sparkplus` ;

-- -----------------------------------------------------
-- Table `sparkplus`.`roadname_code`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`roadname_code` (
  `roadname_code` VARCHAR(12) NOT NULL,
  `roadname` VARCHAR(80) NULL DEFAULT NULL,
  `roadname_eng` VARCHAR(80) NULL DEFAULT NULL,
  `eupmyeondong_number` VARCHAR(2) NOT NULL,
  `sido_name` VARCHAR(20) NULL DEFAULT NULL,
  `sido_eng` VARCHAR(40) NULL DEFAULT NULL,
  `sigungu` VARCHAR(20) NULL DEFAULT NULL,
  `sigungu_eng` VARCHAR(40) NULL DEFAULT NULL,
  `eupmyeondong` VARCHAR(20) NULL DEFAULT NULL,
  `eupmyeondong_eng` VARCHAR(40) NULL DEFAULT NULL,
  `eupmyeondong_type` VARCHAR(1) NULL DEFAULT NULL,
  `eupmyeondong_code` VARCHAR(3) NULL DEFAULT NULL,
  `is_using` VARCHAR(1) NULL DEFAULT NULL,
  `change_reason` VARCHAR(1) NULL DEFAULT NULL,
  `change_history` VARCHAR(14) NULL DEFAULT NULL,
  `declare_date` VARCHAR(8) NULL DEFAULT NULL,
  `expire_date` VARCHAR(8) NULL DEFAULT NULL,
  PRIMARY KEY (`roadname_code`, `eupmyeondong_number`),
  UNIQUE INDEX `roadname_code.roadname_code_unique` (`roadname_code` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sparkplus`.`roadname_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`roadname_address` (
  `manage_number` VARCHAR(25) NOT NULL,
  `basement` VARCHAR(1) NULL DEFAULT NULL,
  `building_primary_number` SMALLINT NULL DEFAULT NULL,
  `building_secondary_number` SMALLINT NULL DEFAULT NULL,
  `basic_area_number` VARCHAR(5) NULL DEFAULT NULL,
  `change_reason_code` VARCHAR(2) NULL DEFAULT NULL,
  `notice_date` VARCHAR(8) NULL DEFAULT NULL,
  `previous_roadname_address` VARCHAR(25) NULL DEFAULT NULL,
  `has_detail` VARCHAR(1) NULL DEFAULT NULL,
  `roadname_code` VARCHAR(12) NOT NULL,
  `eupmyeondong_number` VARCHAR(2) NOT NULL,
  PRIMARY KEY (`manage_number`, `roadname_code`, `eupmyeondong_number`),
  INDEX `fk_address_roadname_idx` (`roadname_code` ASC, `eupmyeondong_number` ASC) VISIBLE,
  CONSTRAINT `roadname_address_ibfk_1`
    FOREIGN KEY (`roadname_code` , `eupmyeondong_number`)
    REFERENCES `sparkplus`.`roadname_code` (`roadname_code` , `eupmyeondong_number`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sparkplus`.`additional_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`additional_info` (
  `manage_number` VARCHAR(25) NOT NULL,
  `hangjungdong_code` VARCHAR(10) NULL DEFAULT NULL,
  `hangjungdong_name` VARCHAR(20) NULL DEFAULT NULL,
  `zipcode` VARCHAR(5) NULL DEFAULT NULL,
  `zipcode_serial_number` VARCHAR(3) NULL DEFAULT NULL,
  `bulk_delivery_building_name` VARCHAR(40) NULL DEFAULT NULL,
  `master_building_name` VARCHAR(40) NULL DEFAULT NULL,
  `sigungu_building_name` VARCHAR(40) NULL DEFAULT NULL,
  `is_apt` VARCHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`manage_number`),
  CONSTRAINT `additional_info_ibfk_1`
    FOREIGN KEY (`manage_number`)
    REFERENCES `sparkplus`.`roadname_address` (`manage_number`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sparkplus`.`jibun_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sparkplus`.`jibun_address` (
  `serial_number` SMALLINT NOT NULL,
  `bupjungdong_code` VARCHAR(10) NOT NULL,
  `sido_name` VARCHAR(20) NOT NULL,
  `sigungu_name` VARCHAR(20) NOT NULL,
  `bupjung_eupmyeondong_name` VARCHAR(20) NOT NULL,
  `bupjungli_name` VARCHAR(20) NOT NULL,
  `is_mountain` VARCHAR(1) NOT NULL,
  `jibun_primary` SMALLINT NOT NULL,
  `jibun_secondary` SMALLINT NOT NULL,
  `is_representation` VARCHAR(1) NOT NULL,
  `manage_number` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`serial_number`, `manage_number`),
  UNIQUE INDEX `jibun_address.manage_number_unique` (`manage_number` ASC) VISIBLE,
  INDEX `fk_jibun_address1_idx` (`manage_number` ASC) VISIBLE,
  CONSTRAINT `jibun_address_ibfk_1`
    FOREIGN KEY (`manage_number`)
    REFERENCES `sparkplus`.`roadname_address` (`manage_number`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
