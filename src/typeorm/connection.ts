import 'reflect-metadata'
import 'dotenv/config'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { ormConfig } from './ormConfig'
import { getAddinfoEntityByTableName } from './entities/addinfo.entity'
import { addMetadata } from './addMetadata'
import TypeOrmLogger from './ormLogger'
import { getJusoEntityByTableName } from './entities/juso.entity'
import { getJibunEntityByTableName } from './entities/jibun.entity'

export async function getConnection(connectionOption: ConnectionOptions): Promise<Connection> {
  try {
    return await createConnection(Object.assign(connectionOption, { logger: new TypeOrmLogger() }))
  } catch (err) {
    throw err
  }
}

async function main() {
  // const roadcode = getRoadnameCodeEntity()
  // const repo = connect.createEntityManager()
  // console.log(await repo.findOne(RoadcodeEntity))

  const connection = await getConnection(ormConfig)
  const addinfo = getAddinfoEntityByTableName('additional_info_seoul')
  const juso = getJusoEntityByTableName('roadname_address_jeju')
  const jibun = getJibunEntityByTableName('jibun_address_daegu')
  addMetadata(connection, addinfo)
  addMetadata(connection, juso)
  addMetadata(connection, jibun)

  console.log(await connection.manager.findOne(addinfo))
  console.log(await connection.manager.findOne(juso))
  console.log(await connection.manager.findOne(jibun))
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
