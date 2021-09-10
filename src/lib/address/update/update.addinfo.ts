import { Connection } from 'typeorm'
import { zipcodeDecoder } from '../../zipcode/zipcode.decoder'

/**
 * 부가정보 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateAddinfoTable(connection: Connection, data: string) {
  const splitData = data.split('|')
  const [manage_number, , , zipcode, , , , , , changeReasonCode] = splitData
  const sidoEngName = zipcodeDecoder(zipcode as string)
  const sql =
    changeReasonCode === '63'
      ? `DELETE FROM additional_info_${sidoEngName} WHERE manage_number = '${manage_number}'`
      : `REPLACE INTO additional_info_${sidoEngName} VALUES ('${splitData
          .slice(0, 9)
          .join("','")}')`

  connection.manager.query(sql)
}
