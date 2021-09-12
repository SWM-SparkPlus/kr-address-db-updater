import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { logger } from '../../logger'
import { queryWithDbcp } from '../../mysqlConnection'
import { zipcodeDecoder } from '../../zipcode/zipcode.decoder'

/**
 * 부가정보 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateAddinfoTable(connection: PoolConnection, data: string) {
  const splitData = data.split('|').map(s => s.replace(`'`, `"`))
  const [
    manage_number,
    hangjungdong_code,
    hangjungdong,
    zipcode,
    zipcode_serial_number,
    bulk_delivery_building_name,
    master_building_name,
    sigungu_building_name,
    is_apt,
    changeReasonCode,
  ] = splitData
  const sidoEngName = zipcodeDecoder(zipcode as string)
  const sql =
    changeReasonCode === '63'
      ? `DELETE FROM additional_info_${sidoEngName} WHERE manage_number = '${manage_number}'`
      : `REPLACE INTO additional_info_${sidoEngName} VALUES ('${manage_number}', '${hangjungdong_code}', '${hangjungdong}', '${zipcode}', '${zipcode_serial_number}', '${bulk_delivery_building_name}', '${master_building_name}', '${sigungu_building_name}', '${is_apt}')`

  try {
    await queryWithDbcp(connection, sql)
  } catch (err) {
    logger.error(`[UPDATE_ADDINFO_ERROR] ${err}`)
  }
}
