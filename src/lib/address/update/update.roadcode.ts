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
  const [roadname_code, , , eupmyeondong_serial_number, , , , , , , , , , change_reason] = splitData
  const sql =
    change_reason === '63'
      ? `DELETE FROM roadname_code WHERE roadname_code = '${roadname_code}' AND eupmyeondong_serial_number = '${eupmyeondong_serial_number}'`
      : `REPLACE INTO roadname_code VALUES ('${splitData.join("','")}')`
  connection.query(sql)
}
