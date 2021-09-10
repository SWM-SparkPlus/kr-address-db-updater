import { Connection } from 'typeorm'
import { zipcodeDecoder } from '../../zipcode/zipcode.decoder'

/**
 * 도로명주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJusoTable(connection: Connection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|')
  const [
    manage_number,
    roadname_code,
    eupmyeondong_serial_number,
    ,
    ,
    ,
    basic_state_number,
    change_reason_code,
  ] = splitData
  const sidoEngName = zipcodeDecoder(basic_state_number)
  const sql =
    change_reason_code === '63'
      ? `DELETE FROM roadname_address_${sidoEngName} WHERE manage_number = '${manage_number}'`
      : `REPLACE INTO roadname_address_${sidoEngName} VALUES ('${splitData.join("','")}')`

  connection.manager.query(sql)
}
