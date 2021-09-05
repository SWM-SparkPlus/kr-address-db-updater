import { Connection } from 'typeorm'
import { JibunModel } from '../../../models/jibun.model'
import { addMetadata } from '../../../typeorm/addMetadata'
import { getJibunEntityByTableName } from '../../../typeorm/entities/jibun.entity'
import { getIndexTableByTableName } from '../../../typeorm/entities/manageNumber.index.entity'
import { SidoObject, TJibunTableName, TSido } from '../../../types/sido.collections'

/**
 * 지번주소 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateJibunTable(connection: Connection, data: string) {
  const splitData = data.split('|')
  const inputData: JibunModel = {
    manage_number: splitData[0],
    serial_number: +splitData[1],
    bupjungdong_code: splitData[2],
    sido: splitData[3],
    sigungu: splitData[4],
    bupjungeupmyeondong: splitData[5],
    bupjungli: splitData[6],
    is_mountain: splitData[7],
    jibun_primary_number: +splitData[8],
    jibun_secondary_number: +splitData[9],
    is_representation: splitData[10],
  }

  const changeReasonCode = splitData[11]

  const jibunIndexEntity = getIndexTableByTableName('jibun_manage_number_index')
  addMetadata(connection, jibunIndexEntity)

  const findJibunIndex = await connection.manager.findOne(jibunIndexEntity, {
    manage_number: inputData.manage_number,
  })

  let tableName = findJibunIndex?.tablename as TJibunTableName

  // 부가정보 인덱스가 존재하지 않아 테이블 특정이 어려울 경우
  if (!findJibunIndex) {
    const sidoEngName = SidoObject[inputData.sido as TSido]
    tableName = `jibun_address_${sidoEngName}` as TJibunTableName

    // 폐지가 아닐 경우 인덱스 테이블에 추가
    if (changeReasonCode !== '63')
      connection.manager.save(
        jibunIndexEntity,
        { manage_number: inputData.manage_number, tablename: tableName },
        { reload: false }
      )
  }

  // 다이나믹 쿼리를 위해 메타데이터 추가
  const jibunTableEntity = getJibunEntityByTableName(tableName)
  addMetadata(connection, jibunTableEntity)

  const existingData = await connection.manager.findOne(jibunTableEntity, {
    manage_number: inputData.manage_number,
    serial_number: inputData.serial_number,
  })

  // if (changeReasonCode === '63') {
  //   if (existingData) connection.manager.delete(jibunTableEntity, {
  //     manage_number: inputData.manage_number, serial_number: inputData.serial_number
  //   })
  // } else {
  //   connection.manager.save(jibunTableEntity, inputData, { reload: false })
  // }

  if (changeReasonCode === '31') {
    if (!existingData) connection.manager.save(jibunTableEntity, inputData, { reload: false })
  } else if (changeReasonCode === '34') {
    if (!existingData) connection.manager.save(jibunTableEntity, inputData, { reload: false })
    else
      connection.manager
        .createQueryBuilder()
        .update(jibunTableEntity)
        .set(inputData)
        .where(`manage_number = :manage_number`, { manage_number: inputData.manage_number })
        .andWhere('serial_number = :serial_number', { serial_number: inputData.serial_number })
    // connection.manager.update(
    //   jibunTableEntity,
    //   { manage_number: inputData.manage_number, serial_number: inputData.serial_number },
    //   inputData
    // )
  } else {
    if (existingData)
      connection.manager.delete(jibunTableEntity, {
        manage_number: inputData.manage_number,
        serial_number: inputData.serial_number,
      })
  }
}
