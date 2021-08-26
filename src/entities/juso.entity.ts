import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class JusoEntity {
  public static tableName: string

  @PrimaryColumn({ type: 'varchar' })
  manage_number!: string
  @Column({ type: 'varchar' })
  roadname_code!: string
  @Column({ type: 'varchar' })
  eupmyeondong_number!: string
  @Column({ type: 'varchar' })
  basement!: string | null
  @Column({ type: 'smallint' })
  building_primary_number!: number | null
  @Column({ type: 'smallint' })
  building_secondary_number!: number | null
  @Column({ type: 'varchar' })
  basic_area_number!: string | null
  @Column({ type: 'varchar' })
  change_reason_code!: string | null
  @Column({ type: 'varchar' })
  notice_date!: string | null
  @Column({ type: 'varchar' })
  previous_roadname_address!: string | null
  @Column({ type: 'varchar' })
  has_detail!: string | null
}
