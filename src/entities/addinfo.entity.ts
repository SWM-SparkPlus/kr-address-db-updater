import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class AddInfoEntity {
  @PrimaryColumn()
  manage_number!: string
  @Column()
  hangjungdong_code!: string | null
  @Column()
  hangjungdong_name!: string | null
  @Column()
  zipcode!: string | null
  @Column()
  zipcode_serial_number!: string | null
  @Column()
  bulk_delivery_building_name!: string | null
  @Column()
  master_building_name!: string | null
  @Column()
  sigungu_building_name!: string | null
  @Column()
  is_apt!: string | null
}
