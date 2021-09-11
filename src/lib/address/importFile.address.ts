import { spawn } from 'child_process'
import { logger } from '../logger'
import { scriptDir } from '../path'

/**
 * MySQL에서 LOAD DATA를 병렬처리 하기위해 자식 프로세스를 생성하는 함수
 *
 * @param tableName 입력할 테이블명. 테이블 명이면서 파일 이름이어야 함.
 */
export const importToDb = (tableName: string) => {
  logger.info(`[IMPORT_START] Import starts with table name: ${tableName}`)

  const importScript = spawn(`sh`, [
    `${scriptDir}/import_total_data.sh`,
    tableName,
  ]).setMaxListeners(0)

  importScript.on('close', () => {
    logger.info(`[IMPORT_COMPLETE] Complete importing on table: ${tableName}`)
  })
}
