import { Connection } from 'typeorm'
import { JusoModel } from '../../../models/juso.model'
import { addMetadata } from '../../../typeorm/addMetadata'
import { getJusoEntityByTableName } from '../../../typeorm/entities/juso.entity'
import { getIndexTableByTableName } from '../../../typeorm/entities/manageNumber.index.entity'
import { RoadcodeEntity } from '../../../typeorm/entities/roadcode.entity'
import { SidoObject, TRoadnameTableName, TSido } from '../../../types/sido.collections'
import { logger } from '../../logger'

/**
 * 도로명주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJusoTable(connection: Connection, data: string) {
  const splitData = data.split('|')
  const inputData: JusoModel = {
    manage_number: splitData[0],
    roadname_code: splitData[1],
    eupmyeondong_serial_number: splitData[2],
    is_basement: splitData[3],
    building_primary_number: +splitData[4],
    building_secondary_number: +splitData[5],
    basic_state_number: splitData[6],
    change_reason_code: splitData[7],
    notice_date: splitData[8],
    previous_roadname_address: splitData[9],
    has_detail: splitData[10],
  }

  const changeReasonCode = splitData[7]

  // 인덱스 테이블 우선 조회
  const jusoIndexEntity = getIndexTableByTableName('juso_manage_number_index')
  addMetadata(connection, jusoIndexEntity)
  const findJusoIndex = await connection.manager.findOne(jusoIndexEntity, {
    manage_number: inputData.manage_number,
  })

  let tableName = findJusoIndex?.tablename

  // 인덱스가 없을 경우 직접 생성
  if (!findJusoIndex) {
    addMetadata(connection, RoadcodeEntity)
    const findByRoadcode = await connection.manager.findOne(RoadcodeEntity, {
      roadname_code: inputData.roadname_code,
    })

    if (!findByRoadcode) {
      return logger.error(
        `No RoadCode found with ${inputData.manage_number}, ${inputData.roadname_code}`
      )
    }

    const sidoEngName = SidoObject[findByRoadcode?.sido as TSido]
    tableName = `roadname_address_${sidoEngName}`

    if (changeReasonCode !== '63')
      connection.manager.save(
        jusoIndexEntity,
        { manage_number: inputData.manage_number, tablename: tableName },
        { reload: false }
      )
  }

  if (tableName?.includes('undefined'))
    logger.info(inputData.manage_number, inputData.roadname_code)

  //  엔터티 생성 후 메터데이터 추가
  const jusoEntity = getJusoEntityByTableName(tableName as TRoadnameTableName)
  addMetadata(connection, jusoEntity)

  const existingData = await connection.manager.findOne(jusoEntity, {
    manage_number: inputData.manage_number,
  })

  // 실제 일일 변동분 업데이트
  if (changeReasonCode === '31') {
    if (!existingData) connection.manager.save(jusoEntity, inputData, { reload: false })
  } else if (changeReasonCode === '34') {
    if (!existingData) connection.manager.save(jusoEntity, inputData, { reload: false })
    else
      connection.manager.update(jusoEntity, { manage_number: inputData.manage_number }, inputData)
  } else if (changeReasonCode === '63') {
    if (existingData)
      connection.manager.delete(jusoEntity, {
        manage_number: inputData.manage_number,
      })
  }
}
