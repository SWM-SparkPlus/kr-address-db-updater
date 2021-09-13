import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { BupjungSidoCodeMap, SidoObject, TBupjungcode } from '../../../types/sido.collections'
import { logger } from '../../logger'
import { queryWithDbcp } from '../../mysqlConnection'

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
  const sidoEngName = SidoObject[BupjungSidoCodeMap[manage_number?.slice(0, 2) as TBupjungcode]]
  const targetTable = `additional_info_${sidoEngName}`

  // const sql =
  //   changeReasonCode === '63'
  //     ? `DELETE FROM additional_info_${sidoEngName} WHERE manage_number = '${manage_number}'`
  //     : `REPLACE INTO additional_info_${sidoEngName} VALUES ('${manage_number}', '${hangjungdong_code}', '${hangjungdong}', '${zipcode}', '${zipcode_serial_number}', '${bulk_delivery_building_name}', '${master_building_name}', '${sigungu_building_name}', '${is_apt}')`

  try {
    const findOneData = await queryWithDbcp(
      connection,
      `SELECT * FROM ${targetTable} WHERE manage_number = '${manage_number}' LIMIT 1`
    )

    if (!findOneData && changeReasonCode === '31') {
      queryWithDbcp(
        connection,
        `INSERT INTO ${targetTable} VALUES ('${manage_number}', '${hangjungdong_code}', '${hangjungdong}', '${zipcode}', '${zipcode_serial_number}', '${bulk_delivery_building_name}', '${master_building_name}', '${sigungu_building_name}', '${is_apt}')`
      )
    } else if (findOneData && changeReasonCode === '34') {
      queryWithDbcp(
        connection,
        `UPDATE ${targetTable} SET hangjungdong_code = '${hangjungdong_code}', hangjungdong = '${hangjungdong}', zipcode = '${zipcode}', zipcode_serial_number = '${zipcode_serial_number}', bulk_delivery_building_name = '${bulk_delivery_building_name}', master_building_name = '${master_building_name}', sigungu_building_name = '${sigungu_building_name}', is_apt = '${is_apt}' WHERE manage_number = '${manage_number}'`
      )
    } else if (findOneData && changeReasonCode === '34') {
      queryWithDbcp(
        connection,
        `DELETE FROM ${targetTable} WHERE manage_number = '${manage_number}'`
      )
    }
  } catch (err) {
    logger.error(`[UPDATE_ADDINFO_ERROR] ${err}`)
  }
}
