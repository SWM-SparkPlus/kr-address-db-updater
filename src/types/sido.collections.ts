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

export type TBupjungcode =
  | '11'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '36'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45'
  | '46'
  | '47'
  | '48'
  | '50'

type TBupjungCodeMap = { [key in TBupjungcode]: TSido }

export const BupjungSidoCodeMap: TBupjungCodeMap = {
  '11': '서울특별시',
  '26': '부산광역시',
  '27': '대구광역시',
  '28': '인천광역시',
  '29': '광주광역시',
  '30': '대전광역시',
  '31': '울산광역시',
  '36': '세종특별자치시',
  '41': '경기도',
  '42': '강원도',
  '43': '충청북도',
  '44': '충청남도',
  '45': '전라북도',
  '46': '전라남도',
  '47': '경상북도',
  '48': '경상남도',
  '50': '제주특별자치도',
}
