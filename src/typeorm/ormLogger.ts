import { Logger, QueryRunner } from 'typeorm'
import { logger } from '../lib/logger'

export default class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // logger.info(`[TypeOrmLogQuery] ${query}`)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error(`[TypeOrmLogQueryError] Error occured on query ${query} : ${error}`)
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.warn(`[TypeOrmLogSlowQuery] Spend ${time}ms for ${query}`)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info(`[TypeOrmSchemaLog] ${message}`)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info(`[TypeOrmMigrationLog] ${message}`)
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    logger.info(`[TypeOrmLog] ${level}: ${message}`)
  }
}
