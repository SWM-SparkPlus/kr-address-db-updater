import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { queryWithDbcp } from '../../mysqlConnection'

/**
 * 도로명코드 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateRoadcodeTable(connection: PoolConnection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|')
  const [
    roadname_code,
    roadname,
    roadname_eng,
    eupmyeondong_serial_number,
    sido,
    sido_eng,
    sigungu,
    sigungu_eng,
    eupmyeondong,
    eupmyeondong_eng,
    eupmyeondong_type,
    eupmyeondong_code,
    is_using,
    change_reason,
    change_history,
    declare_date,
    expire_date,
  ] = splitData

  const findRoadcode = await queryWithDbcp(
    connection,
    `SELECT * FROM roadname_code WHERE roadname_code = '${roadname_code}' AND eupmyeondong_serial_number = '${eupmyeondong_serial_number}' LIMIT 1`
  )

  if (!findRoadcode && change_history === '신규') {
    queryWithDbcp(
      connection,
      `INSERT INTO roadname_code VALUES ('${roadname_code}', '${roadname}', '${roadname_eng}', '${eupmyeondong_serial_number}', '${sido}', '${sido_eng}', '${sigungu}', '${sigungu_eng}', '${eupmyeondong}', '${eupmyeondong_eng}', '${eupmyeondong_type}', '${eupmyeondong_code}', '${is_using}', '${change_reason}', '${change_history}', '${declare_date}', '${expire_date}')`
    )
  } else if (findRoadcode && change_reason === '1') {
    queryWithDbcp(
      connection,
      `DELETE FROM roadname_code WHERE roadname_code = '${roadname_code}' AND eupmyeondong_serial_number = '${eupmyeondong_serial_number}'`
    )
  } else if (findRoadcode && change_reason in [0, 2, 3, 4, 9]) {
    queryWithDbcp(
      connection,
      `UPDATE roadname_code SET roadname = '${roadname}', roadname_eng = '${roadname_eng}', sido = '${sido}', sido_eng = '${sido_eng}', sigungu = '${sigungu}', sigungu_eng = '${sigungu_eng}', eupmyeondong = '${eupmyeondong}', eupmyeondong_eng = '${eupmyeondong_eng}', eupmyeondong_type = '${eupmyeondong_type}', eupmyeondong_code = '${eupmyeondong_code}', is_using =  '${is_using}', change_reason = '${change_reason}', change_history = '${change_history}', declare_date = '${declare_date}', expire_date = '${expire_date}' WHERE roadname_code = '${roadname_code}' AND eupmyeondong_serial_number = '${eupmyeondong_serial_number}'`
    )
  }
}
