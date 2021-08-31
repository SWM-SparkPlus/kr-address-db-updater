import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TAddInfoTableName } from '../../types/sido.type'

export function getAddinfoEntityByTableName(tableName: TAddInfoTableName) {
  @Entity({ name: tableName, synchronize: false })
  class AddInfoEntity {
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
