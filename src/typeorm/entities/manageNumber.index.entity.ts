import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TIndexTableName } from '../../types/sido.collections'

/**
 * 주소 테이블의 인덱스 테이블의 Dynamic query를 위해 엔터티를 리턴하는 함수
 *
 * @param tableName 실제 테이블 이름
 * @returns 테이블 이름이 적용된 TypeORM Entity
 */
export function getIndexTableByTableName(tableName: TIndexTableName) {
  @Entity({ name: tableName, synchronize: false })
  class ManageNumberIndexEntity {
    @PrimaryColumn({ type: 'varchar' })
    manage_number!: string

    @Column({ type: 'varchar' })
    tablename!: string
  }

  return ManageNumberIndexEntity
}
