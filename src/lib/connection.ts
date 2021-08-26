import 'reflect-metadata'
import 'dotenv/config'
import { Connection, ConnectionOptions, createConnection, Logger, QueryRunner } from 'typeorm'
import { getRoadnameCodeEntity, RoadcodeEntity } from '../entities/roadcode.entity'
import { logger } from './logger'

const { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } = process.env

export const connectionOption: ConnectionOptions = {
  type: 'mysql',
  host: MYSQL_HOST,
  port: (MYSQL_PORT as unknown as number) || undefined,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  entities: [__dirname + '/../entities/*.ts'],
  synchronize: false,
  logging: true,
}

class CustomLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`[TypeOrmLogQuery] ${query}`)
  }
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error(`[TypeOrmLogQueryError] Error on ${query}: ${error}`)
  }
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`[TypeOrmLogSlowQuery] ${time} on ${query}`)
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

export async function getConnection(connectionOption: ConnectionOptions): Promise<Connection> {
  try {
    return await createConnection(Object.assign(connectionOption, { logger: new CustomLogger() }))
  } catch (err) {
    throw err
  }
}

class ConnectionService {
  public connectionMap: Map<any, Promise<Connection>> = new Map()
  public connectionOption: ConnectionOptions = {
    type: 'mysql',
    host: MYSQL_HOST,
    port: (MYSQL_PORT as unknown as number) || undefined,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    entities: [__dirname + '/../entities/*.ts'],
    synchronize: false,
    logging: true,
  }

  public async getConnection(entityType: object) {
    const key = entityType

    if (!this.connectionMap.has(key)) {
      const connection = createConnection(connectionOption)
      this.connectionMap.set(key, connection)
    }
    return this.connectionMap.get(key) as Promise<Connection>
  }
}

export const connectionService = new ConnectionService()

async function main() {
  const roadcode = new RoadcodeEntity()
  const connect = await connectionService.getConnection(roadcode)
  const repo = connect.createEntityManager()
  console.log(await repo.find(RoadcodeEntity))
}

main()
  .then(() => {
    console.log('finish')
  })
  .catch(e => {
    console.error(e)
  })
