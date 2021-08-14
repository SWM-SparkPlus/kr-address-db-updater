import { spawn } from 'child_process'
import { prismaClient } from '../prisma/prismaClient'
import { logger } from './logger'

const metaData = {
  additional_info: 'addinfo_manage_number_index',
  jibun_address: 'jibun_manage_number_index',
  roadname_address: 'road_manage_number_index',
}

/**
 * MySQL에서 LOAD DATA를 병렬처리 하기위해 자식 프로세스를 생성하는 함수
 *
 * @param tableName 입력할 테이블명. 테이블 명이면서 파일 이름이어야 함.
 */
export const importToDb = (tableName: string) => {
  logger.info(`[ImportStarts] Import starts with table name: ${tableName}`)

  const importScript = spawn(`sh`, ['./scripts/import_total_data.sh', tableName]).setMaxListeners(0)
  importScript.on(
    'close',
    () => {
      let targetIndexTableName = ''
      if (tableName.includes('additional_info')) {
        targetIndexTableName = 'addinfo_manage_number_index'
      } else if (tableName.includes('jibun_address')) {
        targetIndexTableName = 'jibun_manage_number_index'
      } else if (tableName.includes('roadname_address')) {
        targetIndexTableName = 'juso_manage_number_index'
      }

      logger.info(`[ImportComplete] Complete importing on table: ${tableName}`)
      const importScript = spawn(`sh`, [
        './scripts/create_index.sh',
        targetIndexTableName,
        tableName,
      ]).setMaxListeners(0)

      importScript.on('close', () => {
        logger.info(`[CreateIndexComplete] Complete creating index table with ${tableName}`)
      })
    }
    // addinfo_manage_number_index
    // juso_manage_number_index
    // jibun_manage_number_index
  )
}
