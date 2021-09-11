import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { Connection } from 'typeorm'
import { BupjungSidoCodeMap, SidoObject, TBupjungcode } from '../../../types/sido.collections'
import { logger } from '../../logger'
import { zipcodeDecoder } from '../../zipcode/zipcode.decoder'

/**
 * 도로명주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJusoTable(connection: PoolConnection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|').map(s => s.replace(`'`, `"`))
  const [
    manage_number,
    roadname_code,
    eupmyeondong_serial_number,
    is_basement,
    building_primary_number,
    building_secondary_number,
    basic_state_number,
    change_reason_code,
    notice_date,
    previous_roadname_address,
    has_detail,
  ] = splitData

  const sidoEngName = basic_state_number
    ? zipcodeDecoder(basic_state_number)
    : SidoObject[BupjungSidoCodeMap[roadname_code?.slice(0, 2) as TBupjungcode]]

  const sql =
    change_reason_code === '63'
      ? `DELETE FROM roadname_address_${sidoEngName} WHERE manage_number = '${manage_number}'`
      : `REPLACE INTO roadname_address_${sidoEngName} VALUES ('${manage_number}', '${roadname_code}', '${eupmyeondong_serial_number}', '${is_basement}', '${building_primary_number}', '${building_secondary_number}', '${basic_state_number}', '${change_reason_code}', '${notice_date}', '${previous_roadname_address}', '${has_detail}')`

  try {
    connection.query(sql).on('end', () => connection.release())
  } catch (err) {
    logger.error(`[UPDATE_JUSO_ERROR] ${err}`)
  }
}
