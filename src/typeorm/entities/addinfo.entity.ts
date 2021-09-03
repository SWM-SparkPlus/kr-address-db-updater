import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TAddInfoTableName } from '../../types/sido.collections'

/**
 * 부가정보 테이블의 Dynamic query를 위해 엔터티를 리턴하는 함수
 *
 * @param tableName 실제 테이블 이름
 * @returns 테이블 이름이 적용된 TypeORM Entity
 */
export function getAddinfoEntityByTableName(tableName: TAddInfoTableName) {
  @Entity({ name: tableName, synchronize: false })
  class AddInfoEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @Column({ type: 'varchar' })
    hangjungdong_code!: string | null

    @Column({ type: 'varchar' })
    hangjungdong!: string | null

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
