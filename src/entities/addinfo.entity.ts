import { Column, Connection, Entity, EntitySchema, PrimaryColumn } from 'typeorm'
import { TAddInfoTableName } from '../lib/sido'
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder'
import { EntityMetadataValidator } from 'typeorm/metadata-builder/EntityMetadataValidator'

export function getAddinfoEntityByTableName(tableName: TAddInfoTableName) {
  @Entity({ name: tableName, synchronize: false })
  class AddInfoEntity {
    public static tableName = tableName

    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string
    @Column({ type: 'varchar' })
    hangjungdong_code!: string | null
    @Column({ type: 'varchar' })
    hangjungdong_name!: string | null
    @Column({ type: 'varchar' })
    zipcode!: string | null
    @Column({ type: 'varchar' })
    zipcode_serial_number!: string | null
    @Column({ type: 'varchar' })
    bulk_delivery_building_name!: string | null
    @Column({ type: 'varchar' })
    master_building_name!: string | null
    @Column({ type: 'varchar' })
    sigungu_building_name!: string | null
    @Column({ type: 'varchar' })
    is_apt!: string | null
  }

  return AddInfoEntity
}

export const addMetadata = (
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

@Entity({ synchronize: false })
export class AddInfoEntity {
  @PrimaryColumn({ type: 'varchar' })
  manage_number!: string
  @Column({ type: 'varchar' })
  hangjungdong_code!: string | null
  @Column({ type: 'varchar' })
  hangjungdong_name!: string | null
  @Column({ type: 'varchar' })
  zipcode!: string | null
  @Column({ type: 'varchar' })
  zipcode_serial_number!: string | null
  @Column({ type: 'varchar' })
  bulk_delivery_building_name!: string | null
  @Column({ type: 'varchar' })
  master_building_name!: string | null
  @Column({ type: 'varchar' })
  sigungu_building_name!: string | null
  @Column({ type: 'varchar' })
  is_apt!: string | null
}
