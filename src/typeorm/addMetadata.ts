import { Connection, EntitySchema } from 'typeorm'
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder'
import { EntityMetadataValidator } from 'typeorm/metadata-builder/EntityMetadataValidator'

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
