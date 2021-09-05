import 'reflect-metadata'
import 'dotenv/config'
import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnection,
  getConnectionManager,
} from 'typeorm'
import TypeOrmLogger from './ormLogger'
import { ormConfig } from './typeorm.config'

// export async function getDbConnection(connectionOption: ConnectionOptions): Promise<Connection> {
//   try {
//     const defaultConnection = getConnectionManager().get()

//     if (!defaultConnection) return await createConnection(Object.assign(connectionOption, { logger: new TypeOrmLogger() }))
//     else return defaultConnection
//   } catch (err) {
//     throw err
//   }
// }

let sequence = 0
const connectionManager = new ConnectionManager()

export async function getDbConnection() {
  try {
    const conection = connectionManager.create(
      Object.assign(ormConfig, { name: `conn-${sequence}`, logger: new TypeOrmLogger() })
    )
    sequence++
    return await conection.connect()
  } catch (err) {
    throw err
  }
}
