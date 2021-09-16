import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import { BupjungSidoCodeMap, SidoObject, TBupjungcode } from '../../../types/sido.collections'
import { logger } from '../../logger'
import { getMysqlPoolConnection, queryWithDbcp } from '../../mysqlConnection'

/**
 * 지번주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJibunTable(connection: PoolConnection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|').map(s => s.replace(`'`, `''`))
  const [
    manage_number,
    serial_number,
    bupjungdong_code,
    sido,
    sigungu,
    bupjungeupmyeondong,
    bupjungli,
    is_mountain,
    jibun_primary_number,
    jibun_secondary_number,
    is_representation,
    change_reason_code,
  ] = splitData
  const sidoEngName = SidoObject[BupjungSidoCodeMap[manage_number.slice(0, 2) as TBupjungcode]]
  const targetTable = `jibun_address_${sidoEngName}`
  const targetIntegratedTable = `integrated_address_${sidoEngName}`

  try {
    const findOneData = await queryWithDbcp(
      connection,
      `SELECT * FROM ${targetTable} WHERE manage_number = '${manage_number}' AND serial_number = '${serial_number}' LIMIT 1`
    )

    if (!findOneData && change_reason_code === '31') {
      queryWithDbcp(
        connection,
        `INSERT INTO ${targetTable} VALUES ('${manage_number}', '${serial_number}', '${bupjungdong_code}', '${sido}', '${sigungu}', '${bupjungeupmyeondong}', '${bupjungli}', '${is_mountain}', '${jibun_primary_number}', '${jibun_secondary_number}', '${is_representation}')`
      )
    } else if (findOneData && change_reason_code === '34') {
      queryWithDbcp(
        connection,
        `UPDATE ${targetTable} SET serial_number = '${serial_number}', bupjungdong_code = '${bupjungdong_code}', sido = '${sido}', sigungu = '${sigungu}', bupjungeupmyeondong = '${bupjungeupmyeondong}', bupjungli = '${bupjungli}', is_mountain = '${is_mountain}', jibun_primary_number = '${jibun_primary_number}', jibun_secondary_number = '${jibun_secondary_number}', is_representation = '${is_representation}' WHERE manage_number = '${manage_number}' AND serial_number = '${serial_number}'`
      )
    } else if (findOneData && change_reason_code === '63') {
      queryWithDbcp(
        connection,
        `DELETE FROM ${targetTable} WHERE manage_number = '${manage_number}' AND serial_number = '${serial_number}'`
      )
    }

    // queryWithDbcp(connection, sql)
    const findData = await queryWithDbcp(
      connection,
      `SELECT * FROM ${targetIntegratedTable} WHERE manage_number = '${manage_number}' LIMIT 1`
    )

    if (!findData && change_reason_code === '31') {
      queryWithDbcp(
        connection,
        `INSERT INTO ${targetIntegratedTable} (manage_number, bupjungli, bupjungdong_code) VALUES ('${manage_number}', '${bupjungli}', '${bupjungdong_code}')`
      )
    } else if (findData && change_reason_code === '34') {
      queryWithDbcp(
        connection,
        `UPDATE ${targetIntegratedTable} SET bupjungli = '${bupjungli}', bupjungdong_code = '${bupjungdong_code}' WHERE manage_number = '${manage_number}'`
      )
    }
  } catch (err) {
    logger.error(`[UPDATE_JUSO_ERROR] ${err}`)
  }
}
