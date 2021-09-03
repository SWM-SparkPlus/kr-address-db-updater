import { Connection } from 'typeorm'
import { addMetadata } from '../../../typeorm/addMetadata'
import { RoadcodeEntity } from '../../../typeorm/entities/roadcode.entity'

/**
 * 도로명코드 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateRoadcodeTable(connection: Connection, data: string) {
  if (data === 'No Data') return

  const splitData = data.split('|')
  const inputData: RoadcodeEntity = {
    roadname_code: splitData[0],
    roadname: splitData[1],
    roadname_eng: splitData[2],
    eupmyeondong_number: splitData[3],
    sido_name: splitData[4],
    sido_eng: splitData[5],
    sigungu: splitData[6],
    sigungu_eng: splitData[7],
    eupmyeondong: splitData[8],
    eupmyeondong_eng: splitData[9],
    eupmyeondong_type: splitData[10],
    eupmyeondong_code: splitData[11],
    is_using: splitData[12],
    change_reason: splitData[13],
    change_history: splitData[14],
    declare_date: splitData[15],
    expire_date: splitData[16],
  }

  addMetadata(connection, RoadcodeEntity)

  const findResult = await connection.manager.findOne(RoadcodeEntity, {
    roadname_code: inputData.roadname_code,
    eupmyeondong_code: inputData.eupmyeondong_code,
  })

  if (!findResult) {
    connection.manager.save(RoadcodeEntity, inputData, { reload: false })
  } else {
    connection.manager.update(
      RoadcodeEntity,
      {
        roadname_code: inputData.roadname_code,
        eupmyeondong_code: inputData.eupmyeondong_code,
      },
      inputData
    )
  }
}
