import { Entity } from 'typeorm'

@Entity()
export class JusoEntity {
  manage_number!: string
  roadname_code!: string
  eupmyeondong_number!: string
  basement!: string | null
  building_primary_number!: number | null
  building_secondary_number!: number | null
  basic_area_number!: string | null
  change_reason_code!: string | null
  notice_date!: string | null
  previous_roadname_address!: string | null
  has_detail!: string | null
}
