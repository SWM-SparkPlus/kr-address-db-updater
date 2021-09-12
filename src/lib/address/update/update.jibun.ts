import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection'
import {
  BupjungSidoCodeMap,
  SidoObject,
  TBupjungcode,
  TSido,
} from '../../../types/sido.collections'
import { logger } from '../../logger'
import { queryWithDbcp } from '../../mysqlConnection'

/**
 * 지번주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJibunTable(connection: PoolConnection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|').map(s => s.replace(`'`, `"`))
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
  const sidoEngName = sido
    ? SidoObject[sido as TSido]
    : SidoObject[BupjungSidoCodeMap[manage_number.slice(0, 2) as TBupjungcode]]
  const sql =
    change_reason_code === '63'
      ? `DELETE FROM jibun_address_${sidoEngName} WHERE manage_number = '${manage_number}' AND serial_number = '${serial_number}'`
      : `REPLACE INTO jibun_address_${sidoEngName} VALUES ('${manage_number}', '${serial_number}', '${bupjungdong_code}', '${sido}', '${sigungu}', '${bupjungeupmyeondong}', '${bupjungli}', '${is_mountain}', '${jibun_primary_number}', '${jibun_secondary_number}', '${is_representation}')`

  try {
    await queryWithDbcp(connection, sql)
  } catch (err) {
    logger.error(`[UPDATE_JUSO_ERROR] ${err}`)
  }
}
