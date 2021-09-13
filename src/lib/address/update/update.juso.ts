import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { RoadcodeEntity } from '../../../typeorm/entities/roadcode.entity'
import { BupjungSidoCodeMap, SidoObject, TBupjungcode } from '../../../types/sido.collections'
import { logger } from '../../logger'
import { queryWithDbcp } from '../../mysqlConnection'

/**
 * 도로명주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJusoTable(connection: PoolConnection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|').map(s => s.replace(`'`, `''`))
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
  const sidoEngName = SidoObject[BupjungSidoCodeMap[manage_number.slice(0, 2) as TBupjungcode]]
  const targetTable = `roadname_address_${sidoEngName}`
  const targetIntegratedTable = `integrated_address_${sidoEngName}`

  try {
    const findOneData = await queryWithDbcp(
      connection,
      `SELECT * FROM ${targetTable} WHERE manage_number = '${manage_number}' LIMIT 1`
    )

    if (!findOneData && change_reason_code === '31') {
      queryWithDbcp(
        connection,
        `INSERT INTO ${targetTable} VALUES ('${manage_number}', '${roadname_code}', '${eupmyeondong_serial_number}', '${is_basement}', '${building_primary_number}', '${building_secondary_number}', '${basic_state_number}', '${change_reason_code}', '${notice_date}', '${previous_roadname_address}', '${has_detail}')`
      )
    } else if (findOneData && change_reason_code === '34') {
      queryWithDbcp(
        connection,
        `UPDATE ${targetTable} SET roadname_code = '${roadname_code}', eupmyeondong_serial_number = '${eupmyeondong_serial_number}', is_basement = '${is_basement}', building_primary_number = '${building_primary_number}', building_secondary_number = '${building_secondary_number}', basic_state_number = '${basic_state_number}', change_reason_code = '${change_reason_code}', notice_date = '${notice_date}', previous_roadname_address = '${previous_roadname_address}', has_detail = '${has_detail}' WHERE manage_number = '${manage_number}'`
      )
    } else if (findOneData && change_reason_code === '63') {
      queryWithDbcp(
        connection,
        `DELETE FROM ${targetTable} WHERE manage_number = '${manage_number}'`
      )
    }

    const findData = await queryWithDbcp(
      connection,
      `SELECT * FROM ${targetIntegratedTable} WHERE manage_number = '${manage_number}' LIMIT 1`
    )

    if (!findData && change_reason_code === '31') {
      await queryWithDbcp(
        connection,
        `INSERT INTO ${targetIntegratedTable} (manage_number, roadname_code, zipcode, is_basement, building_primary_number, building_secondary_number) VALUES ('${manage_number}', '${roadname_code}', '${basic_state_number}', '${is_basement}, '${building_primary_number}', '${building_secondary_number}')`
      )
      const roadcodeData: RoadcodeEntity = await queryWithDbcp(
        connection,
        `SELECT * FROM roadname_code WHERE roadname_code = '${roadname_code}' LIMIT 1`
      )
      await queryWithDbcp(
        connection,
        `UPDATE ${targetIntegratedTable} SET sido = '${roadcodeData.sido}', sigungu = '${roadcodeData.sigungu}', eupmyeondong = '${roadcodeData.eupmyeondong}', roadname = '${roadcodeData.roadname}' WHERE roadname_code = '${roadname_code}'`
      )
    } else if (findData && change_reason_code === '34') {
      queryWithDbcp(
        connection,
        `UPDATE ${targetIntegratedTable} SET roadname_code = '${roadname_code}', zipcode = '${basic_state_number}', is_basement = '${is_basement}', building_primary_number = '${building_primary_number}', building_secondary_number = '${building_secondary_number}' WHERE manage_number = '${manage_number}'`
      )
    }
  } catch (err) {
    logger.error(`[UPDATE_JUSO_ERROR] ${err}`)
  }
}
