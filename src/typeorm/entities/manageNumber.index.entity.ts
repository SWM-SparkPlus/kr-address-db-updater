import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TIndexTableName } from '../../lib/sido'

export function getManageNumberIndexTableName(tableName: TIndexTableName) {
  @Entity({ name: tableName, synchronize: false })
  class ManageNumberIndexEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @Column({ type: 'varchar' })
    tablename!: string
  }

  return ManageNumberIndexEntity
}
