import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'
import { AddInfoEntity } from '../entities/addinfo.entity'
import { JusoEntity } from '../entities/juso.entity'
import { JibunEntity } from '../entities/jibun.entity'

const { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } = process.env

const connectionOption: ConnectionOptions = {
  type: 'mysql',
  host: MYSQL_HOST,
  port: (MYSQL_PORT as unknown as number) || undefined,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  entities: [__dirname + '/../entities/*.ts'],
  synchronize: false,
  logging: false,
}

createConnection(connectionOption)
  .then(async connection => {
    // here you can start to work with your entities
  })
  .catch(error => console.log(error))
