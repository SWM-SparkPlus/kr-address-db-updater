import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

export function getRoadnameCodeEntity() {
  @Entity({ name: 'roadname_code' })
  class RoadcodeEntity {
    public static tableName = 'roadname_code'

    @PrimaryColumn({ type: 'varchar' })
    roadname_code!: string
    @Column({ type: 'varchar' })
    roadname!: string
    @Column({ type: 'varchar' })
    roadname_eng!: string
    @PrimaryColumn({ type: 'varchar' })
    eupmyeondong_number!: string
    @Column({ type: 'varchar' })
    sido_name!: string
    @Column({ type: 'varchar' })
    sido_eng!: string
    @Column({ type: 'varchar' })
    sigungu!: string
    @Column({ type: 'varchar' })
    sigungu_eng!: string
    @Column({ type: 'varchar' })
    eupmyeondong!: string
    @Column({ type: 'varchar' })
    eupmyeondong_eng!: string
    @Column({ type: 'varchar' })
    eupmyeondong_type!: string
    @Column({ type: 'varchar' })
    eupmyeondong_code!: string
    @Column({ type: 'varchar' })
    is_using!: string
    @Column({ type: 'varchar' })
    change_reason!: string
    @Column({ type: 'varchar' })
    change_history!: string
    @Column({ type: 'varchar' })
    declare_date!: string
    @Column({ type: 'varchar' })
    expire_date!: string
  }

  return RoadcodeEntity
}

@Entity({ name: 'roadname_code' })
export class RoadcodeEntity extends BaseEntity {
  public static tableName: string

  @PrimaryColumn({ type: 'varchar' })
  roadname_code!: string
  @Column({ type: 'varchar' })
  roadname!: string
  @Column({ type: 'varchar' })
  roadname_eng!: string
  @PrimaryColumn({ type: 'varchar' })
  eupmyeondong_number!: string
  @Column({ type: 'varchar' })
  sido_name!: string
  @Column({ type: 'varchar' })
  sido_eng!: string
  @Column({ type: 'varchar' })
  sigungu!: string
  @Column({ type: 'varchar' })
  sigungu_eng!: string
  @Column({ type: 'varchar' })
  eupmyeondong!: string
  @Column({ type: 'varchar' })
  eupmyeondong_eng!: string
  @Column({ type: 'varchar' })
  eupmyeondong_type!: string
  @Column({ type: 'varchar' })
  eupmyeondong_code!: string
  @Column({ type: 'varchar' })
  is_using!: string
  @Column({ type: 'varchar' })
  change_reason!: string
  @Column({ type: 'varchar' })
  change_history!: string
  @Column({ type: 'varchar' })
  declare_date!: string
  @Column({ type: 'varchar' })
  expire_date!: string
}
