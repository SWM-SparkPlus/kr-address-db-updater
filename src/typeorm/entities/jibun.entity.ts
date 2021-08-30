import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TJibunTableName } from '../../lib/sido'

export function getJibunEntityByTableName(tableName: TJibunTableName) {
  @Entity({ name: tableName, synchronize: false })
  class JibunEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @Column({ type: 'smallint' })
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
