import { Connection } from 'typeorm'
import { SidoObject, TSido } from '../../../types/sido.collections'

/**
 * 지번주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJibunTable(connection: Connection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|')
  const [manage_number, serial_number, , sido, , , , , , , , changeReasonCode] = splitData
  const sidoEngName = SidoObject[sido as TSido]
  const sql =
    changeReasonCode === '63'
      ? `DELETE FROM jibun_address_${sidoEngName} WHERE manage_number = '${manage_number}' AND serial_number = '${serial_number}'`
      : `REPLACE INTO jibun_address_${sidoEngName} VALUES ('${splitData.slice(0, 11).join("','")}')`
  connection.manager.query(sql)
}
