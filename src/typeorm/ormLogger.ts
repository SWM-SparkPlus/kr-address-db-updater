import { Logger, QueryRunner } from 'typeorm'
import { logger } from '../lib/logger'

export default class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`[TYPEORM_QUERY] query: ${query}`)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error(`[TYPEORM_QUERY_ERROR] Error on query: ${query}\n${error}`)
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.warn(`[TYPEORM_SLOW_QUERY] Spend ${time}ms for ${query}`)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info(`[TYPEORM_SCHEMA_BUILD] ${message}`)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info(`[TYPEORM_MIGRATION] ${message}`)
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    logger.info(`[TYPEORM_LOG] ${level}: ${message}`)
  }
}
