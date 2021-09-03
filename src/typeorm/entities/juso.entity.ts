import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TRoadnameTableName } from '../../types/sido.collections'

/**
 * 도로명주소 테이블의 Dynamic query를 위해 엔터티를 리턴하는 함수
 *
 * @param tableName 실제 테이블 이름
 * @returns 테이블 이름이 적용된 TypeORM Entity
 */
export function getJusoEntityByTableName(tableName: TRoadnameTableName) {
  @Entity({ name: tableName, synchronize: false })
  class JusoEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @Column({ type: 'varchar' })
    roadname_code!: string

    @Column({ type: 'varchar' })
    eupmyeondong_serial_number!: string

    @Column({ type: 'varchar' })
    is_basement!: string | null

    @Column({ type: 'smallint' })
    building_primary_number!: number | null

    @Column({ type: 'smallint' })
    building_secondary_number!: number | null

    @Column({ type: 'varchar' })
    basic_state_number!: string | null

    @Column({ type: 'varchar' })
    change_reason_code!: string | null

    @Column({ type: 'varchar' })
    notice_date!: string | null

    @Column({ type: 'varchar' })
    previous_roadname_address!: string | null

    @Column({ type: 'varchar' })
    has_detail!: string | null
  }

  return JusoEntity
}
