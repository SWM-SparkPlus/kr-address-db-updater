/**
 * 우편번호를 입력받고 광역시도 영문명을 리턴하는 함수
 *
 * @param zipcode 우편번호(기초구역번호)
 * @returns 광역시도 영문명
 */
export const zipcodeDecoder = (zipcode: string) => {
  const sidoNumber = +zipcode.slice(0, 2)

  if (sidoNumber < 10) return 'seoul'
  else if (sidoNumber <= 20) return 'gyeonggi'
  else if (sidoNumber <= 23) return 'incheon'
  else if (sidoNumber <= 26) return 'gangwon'
  else if (sidoNumber <= 29) return 'chungbuk'
  else if (sidoNumber === 30) return 'sejong'
  else if (sidoNumber <= 33) return 'chungnam'
  else if (sidoNumber <= 35) return 'daejeon'
  else if (sidoNumber <= 40) return 'gyeongbuk'
  else if (sidoNumber <= 43) return 'daegu'
  else if (sidoNumber <= 45) return 'ulsan'
  else if (sidoNumber <= 49) return 'busan'
  else if (sidoNumber <= 53) return 'gyeongnam'
  else if (sidoNumber <= 56) return 'jeonbuk'
  else if (sidoNumber <= 60) return 'jeonnam'
  else if (sidoNumber <= 62) return 'gwangju'
  else if (sidoNumber === 63) return 'jeju'
}
