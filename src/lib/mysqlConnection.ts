import mysql from 'mysql2'
import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { logger } from './logger'
import './env'

const connectionPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 150,
  queueLimit: 0,
  connectTimeout: 20,
})

export async function getMysqlPoolConnection(): Promise<PoolConnection> {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((err, connection) => {
      if (err) reject(err)

      resolve(connection)
    })
  })
}

export async function queryWithDbcp(connection: PoolConnection, sql: string): Promise<any> {
  return new Promise((resolve, reject) => {
    logger.info(`[MYSQL_QUERY_START] ${sql}`)
    connection.query(sql, (err, result) => {
      if (err) {
        logger.error(`[MYSQL_QUERY_ERROR] ${err} running ${sql}`)
        reject(err)
      }

      connection.release()
      logger.info(`[MYSQL_QUERY_ENDS] ${sql}`)
      resolve(result)
    })
  })
}
