import { Connection, EntitySchema } from 'typeorm'
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder'
import { EntityMetadataValidator } from 'typeorm/metadata-builder/EntityMetadataValidator'

/**
 * TypeORM의 dynamic query를 위해 Entity의 metadata를 추가하는 함수
 *
 * @param connection TypeORM 커넥션
 * @param entity Metadata를 추가할 Entity
 */
export const addMetadata = async (
  connection: Connection,
  entity: Function | EntitySchema<any> | string
) => {
  if (connection.hasMetadata(entity)) return

  const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection)
  const entityMetadataValidator = new EntityMetadataValidator()

  const entityMetadata = connectionMetadataBuilder.buildEntityMetadatas([entity])
  connection.entityMetadatas.push(...entityMetadata)
  entityMetadataValidator.validateMany(
    entityMetadata.filter(metadata => {
      return metadata.tableType !== 'view'
    }),
    connection.driver
  )
}
