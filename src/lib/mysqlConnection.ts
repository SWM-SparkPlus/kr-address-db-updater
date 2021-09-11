import mysql from 'mysql2'
import dotenv from 'dotenv'
import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'

dotenv.config()

const connectionPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 5000,
  queueLimit: 0,
  connectTimeout: 300,
})

export async function getMysqlConnection(): Promise<PoolConnection> {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((err, connection) => {
      if (err) reject(err)

      resolve(connection)
    })
  })
}
