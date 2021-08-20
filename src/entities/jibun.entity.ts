import { Entity } from 'typeorm'

@Entity()
export class JibunEntity {
  manage_number!: string
  serial_number!: number
  bupjungdong_code!: string | null
  sido_name!: string | null
  sigungu_name!: string | null
  bupjung_eupmyeondong_name!: string | null
  bupjunglee_name!: string | null
  is_mountain!: string | null
  jibun_primary!: number | null
  jibun_secondary!: number | null
  is_representation!: string | null
}
