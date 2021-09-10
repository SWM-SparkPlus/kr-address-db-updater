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

export type TAddInfoTableName = `additional_info_${ValueOf<TSidoObject>}`
export type TRoadnameTableName = `roadname_address_${ValueOf<TSidoObject>}`
export type TJibunTableName = `jibun_address_${ValueOf<TSidoObject>}`
export type TIntegratedAddressTableName = `integrated_address_${ValueOf<TSidoObject>}`
export type TIndexTableName =
  | 'juso_manage_number_index'
  | 'jibun_manage_number_index'
  | 'addinfo_manage_number_index'

export enum EIndexTables {
  AdditionalInfo = 'addinfo_manage_number_index',
  JibunAddress = 'jibun_manage_number_index',
  RoadnameAddress = 'road_manage_number_index',
}

type BupjungSidoCode = { [key in TSido]: number }

export const BupjungSidoCodeMap: BupjungSidoCode = {
  서울특별시: 11,
  부산광역시: 26,
  대구광역시: 27,
  인천광역시: 28,
  광주광역시: 29,
  대전광역시: 30,
  울산광역시: 31,
  세종특별자치시: 36,
  경기도: 41,
  강원도: 42,
  충청북도: 43,
  충청남도: 44,
  전라북도: 45,
  전라남도: 46,
  경상북도: 47,
  경상남도: 48,
  제주특별자치도: 50,
}
