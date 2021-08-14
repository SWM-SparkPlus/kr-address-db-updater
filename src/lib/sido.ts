import {
  additional_info_busan,
  additional_info_chungbuk,
  additional_info_chungnam,
  additional_info_daegu,
  additional_info_daejeon,
  additional_info_gangwon,
  additional_info_gwangju,
  additional_info_gyeongbuk,
  additional_info_gyeonggi,
  additional_info_gyeongnam,
  additional_info_incheon,
  additional_info_jeju,
  additional_info_jeonbuk,
  additional_info_jeonnam,
  additional_info_sejong,
  additional_info_seoul,
  additional_info_ulsan,
  jibun_address_busan,
  jibun_address_chungbuk,
  jibun_address_chungnam,
  jibun_address_daegu,
  jibun_address_daejeon,
  jibun_address_gangwon,
  jibun_address_gwangju,
  jibun_address_gyeongbuk,
  jibun_address_gyeonggi,
  jibun_address_gyeongnam,
  jibun_address_incheon,
  jibun_address_jeju,
  jibun_address_jeonbuk,
  jibun_address_jeonnam,
  jibun_address_sejong,
  jibun_address_seoul,
  jibun_address_ulsan,
  Prisma,
  roadname_address_busan,
  roadname_address_chungbuk,
  roadname_address_chungnam,
  roadname_address_daegu,
  roadname_address_daejeon,
  roadname_address_gangwon,
  roadname_address_gwangju,
  roadname_address_gyeongbuk,
  roadname_address_gyeonggi,
  roadname_address_gyeongnam,
  roadname_address_incheon,
  roadname_address_jeju,
  roadname_address_jeonbuk,
  roadname_address_jeonnam,
  roadname_address_sejong,
  roadname_address_seoul,
  roadname_address_ulsan,
} from '@prisma/client'

export type TSido =
  | '서울특별시'
  | '인천광역시'
  | '대전광역시'
  | '대구광역시'
  | '광주광역시'
  | '울산광역시'
  | '부산광역시'
  | '세종특별자치시'
  | '제주특별자치도'
  | '경기도'
  | '강원도'
  | '충청남도'
  | '충청북도'
  | '전라남도'
  | '전라북도'
  | '경상남도'
  | '경상북도'

export type TSidoEng =
  | 'seoul'
  | 'incheon'
  | 'daejeon'
  | 'daegu'
  | 'ulsan'
  | 'busan'
  | 'gwangju'
  | 'sejong'
  | 'jeju'
  | 'gyeonggi'
  | 'gangwon'
  | 'chungnam'
  | 'chungbuk'
  | 'jeonnam'
  | 'jeonbuk'
  | 'gyeongnam'
  | 'gyeongbuk'

export type TSidoObject = {
  [key in TSido]: TSidoEng
}

export const SidoObject: TSidoObject = {
  서울특별시: 'seoul',
  인천광역시: 'incheon',
  대전광역시: 'daejeon',
  대구광역시: 'daegu',
  광주광역시: 'gwangju',
  울산광역시: 'ulsan',
  부산광역시: 'busan',
  세종특별자치시: 'sejong',
  제주특별자치도: 'jeju',
  경기도: 'gyeonggi',
  강원도: 'gangwon',
  충청남도: 'chungnam',
  충청북도: 'chungbuk',
  전라남도: 'jeonnam',
  전라북도: 'jeonbuk',
  경상남도: 'gyeongnam',
  경상북도: 'gyeongbuk',
}

type ValueOf<T> = T[keyof T]

export type TTablePrefix = 'additional_info' | 'roadname_address' | 'jibun_address'

export type TAddInfoTableName = `additional_info_${ValueOf<TSidoObject>}`
export type TRoadnameTableName = `roadname_address_${ValueOf<TSidoObject>}`
export type TJibunTableName = `jibun_address_${ValueOf<TSidoObject>}`

export type TIntegratedTableName = TAddInfoTableName | TRoadnameTableName | TJibunTableName
export type TIntegratedTableSchema = TAddInfoTableSchema | TJibunTableSchema | TRoadnameTableSchema

export type TAddInfoTableSchema = additional_info_busan &
  additional_info_seoul &
  additional_info_chungbuk &
  additional_info_chungnam &
  additional_info_daegu &
  additional_info_daejeon &
  additional_info_gangwon &
  additional_info_gwangju &
  additional_info_gyeonggi &
  additional_info_incheon &
  additional_info_gyeongbuk &
  additional_info_gyeongnam &
  additional_info_jeju &
  additional_info_jeonbuk &
  additional_info_sejong &
  additional_info_jeonnam &
  additional_info_ulsan

export type TJibunTableSchema = jibun_address_busan &
  jibun_address_seoul &
  jibun_address_chungbuk &
  jibun_address_chungnam &
  jibun_address_daegu &
  jibun_address_daejeon &
  jibun_address_gangwon &
  jibun_address_gwangju &
  jibun_address_gyeonggi &
  jibun_address_incheon &
  jibun_address_gyeongbuk &
  jibun_address_gyeongnam &
  jibun_address_jeju &
  jibun_address_jeonbuk &
  jibun_address_sejong &
  jibun_address_jeonnam &
  jibun_address_ulsan

export type TRoadnameTableSchema = roadname_address_busan &
  roadname_address_seoul &
  roadname_address_chungbuk &
  roadname_address_chungnam &
  roadname_address_daegu &
  roadname_address_daejeon &
  roadname_address_gangwon &
  roadname_address_gwangju &
  roadname_address_gyeonggi &
  roadname_address_incheon &
  roadname_address_gyeongbuk &
  roadname_address_gyeongnam &
  roadname_address_jeju &
  roadname_address_jeonbuk &
  roadname_address_sejong &
  roadname_address_jeonnam &
  roadname_address_ulsan
