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

export type TSidoObject = {
  [key in TSido]: string
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
