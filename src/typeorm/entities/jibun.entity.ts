import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TJibunTableName } from '../../types/sido.collections'

/**
 * 지번주소 테이블의 Dynamic query를 위해 엔터티를 리턴하는 함수
 *
 * @param tableName 실제 테이블 이름
 * @returns 테이블 이름이 적용된 TypeORM Entity
 */
export function getJibunEntityByTableName(tableName: TJibunTableName) {
  @Entity({ name: tableName, synchronize: false })
  class JibunEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @PrimaryColumn({ type: 'smallint' })
    serial_number!: number

    @Column({ type: 'varchar' })
    bupjungdong_code!: string | null

    @Column({ type: 'varchar' })
    sido_name!: string | null

    @Column({ type: 'varchar' })
    sigungu_name!: string | null

    @Column({ type: 'varchar' })
    bupjung_eupmyeondong_name!: string | null

    @Column({ type: 'varchar' })
    bupjunglee_name!: string | null

    @Column({ type: 'varchar' })
    is_mountain!: string | null

    @Column({ type: 'smallint' })
    jibun_primary!: number | null

    @Column({ type: 'smallint' })
    jibun_secondary!: number | null

    @Column({ type: 'varchar' })
    is_representation!: string | null
  }

  return JibunEntity
}
