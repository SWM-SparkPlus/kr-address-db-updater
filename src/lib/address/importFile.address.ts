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

    let targetIndexTableName = ''
    if (tableName.includes('additional_info')) {
      targetIndexTableName = 'addinfo_manage_number_index'
    } else if (tableName.includes('jibun_address')) {
      targetIndexTableName = 'jibun_manage_number_index'
    } else if (tableName.includes('roadname_address')) {
      targetIndexTableName = 'juso_manage_number_index'
    }

    if (targetIndexTableName) {
      const createIndexEvent = spawn(`sh`, [
        `${scriptDir}/create_index.sh`,
        targetIndexTableName,
        tableName,
      ]).setMaxListeners(0)

      createIndexEvent.on('close', () => {
        logger.info(`[CREATE_INDEX_COMPLETE] Job done on ${tableName}`)
      })
    }
  })
}
