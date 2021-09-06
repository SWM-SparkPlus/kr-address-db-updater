import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TIntegratedAddressTableName } from '../../types/sido.collections'

/**
 * 통합 주소 테이블의 Dynamic query를 위해 엔터티를 리턴하는 함수
 *
 * @param tableName 실제 테이블 이름
 * @returns 테이블 이름이 적용된 TypeORM Entity
 */
export function getIntegratedAddressTableEntity(tableName: TIntegratedAddressTableName) {
  @Entity({ name: tableName, synchronize: false })
  class IntegratedTableEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @Column({ type: 'varchar' })
    roadname_code!: string | null

    @Column({ type: 'varchar' })
    zipcode!: string | null

    @Column({ type: 'varchar' })
    sido!: string | null

    @Column({ type: 'varchar' })
    sigungu!: string | null

    @Column({ type: 'varchar' })
    eupmyeondong!: string | null

    @Column({ type: 'varchar' })
    bupjungli!: string | null

    @Column({ type: 'varchar' })
    roadname!: string | null

    @Column({ type: 'varchar' })
    is_basement!: string | null

    @Column({ type: 'smallint' })
    building_primary_number!: string | null

    @Column({ type: 'smallint' })
    building_secondary_number!: string | null

    @Column({ type: 'varchar' })
    bupjungdong_code!: string | null
  }

  return IntegratedTableEntity
}
