import { Logger, QueryRunner } from 'typeorm'
import { logger } from '../lib/logger'

export default class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`[TypeORMLogQuery] ${query}`)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error(`[TypeORMLogQueryError] Error occured on query ${query} : ${error}`)
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.warn(`[TypeORMLogSlowQuery] Spend ${time}ms for ${query}`)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info(`[TypeORMSchemaLog] ${message}`)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info(`[TypeORMMigrationLog] ${message}`)
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    logger.info(`[TypeORMLog] ${level}: ${message}`)
  }
}
