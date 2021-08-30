import 'reflect-metadata'
import 'dotenv/config'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import TypeOrmLogger from './ormLogger'

export async function getConnection(connectionOption: ConnectionOptions): Promise<Connection> {
  try {
    return await createConnection(Object.assign(connectionOption, { logger: new TypeOrmLogger() }))
  } catch (err) {
    throw err
  }
}
