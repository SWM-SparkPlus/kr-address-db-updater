import 'reflect-metadata'
import { ConnectionManager } from 'typeorm'
import TypeOrmLogger from './ormLogger'
import { ormConfig } from './typeorm.config'

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
