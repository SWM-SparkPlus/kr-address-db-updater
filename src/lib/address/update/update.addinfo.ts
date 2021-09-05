import { Connection } from 'typeorm'
import { AddInfoModel } from '../../../models/addInfo.model'
import { addMetadata } from '../../../typeorm/addMetadata'
import { getAddinfoEntityByTableName } from '../../../typeorm/entities/addinfo.entity'
import { getIndexTableByTableName } from '../../../typeorm/entities/manageNumber.index.entity'
import { TAddInfoTableName } from '../../../types/sido.collections'
import { zipcodeDecoder } from '../../zipcode/zipcode.decoder'

/**
 * 부가정보 테이블 업데이트 함수
 *
 * @param connection TypeORM connection
 * @param data 파이프(|)로 나누어진 문자열 라인
 */
export async function updateAddinfoTable(connection: Connection, data: string) {
  const splitData = data.split('|')
  const inputData: AddInfoModel = {
    manage_number: splitData[0],
    hangjungdong_code: splitData[1],
    hangjungdong: splitData[2],
    zipcode: splitData[3],
    zipcode_serial_number: splitData[4],
    bulk_delivery_building_name: splitData[5],
    master_building_name: splitData[6],
    sigungu_building_name: splitData[7],
    is_apt: splitData[8],
  }

  const changeReasonCode = splitData[9]

  const addinfoIndexEntity = getIndexTableByTableName('addinfo_manage_number_index')
  addMetadata(connection, addinfoIndexEntity)

  const findAddinfoIndex = await connection.manager.findOne(addinfoIndexEntity, {
    manage_number: inputData.manage_number,
  })

  let tableName = findAddinfoIndex?.tablename as TAddInfoTableName

  // 부가정보 인덱스가 존재하지 않아 테이블 특정이 어려울 경우
  if (!findAddinfoIndex) {
    if (!inputData.zipcode) return

    const sidoEngName = zipcodeDecoder(inputData!.zipcode)
    tableName = `additional_info_${sidoEngName}` as TAddInfoTableName
    addMetadata(connection, getAddinfoEntityByTableName(tableName))

    // 폐지가 아닐 경우 인덱스 테이블에 추가
    if (changeReasonCode !== '63')
      connection.manager.save(
        addinfoIndexEntity,
        { manage_number: inputData.manage_number, tablename: tableName },
        { reload: false }
      )
  }

  // 다이나믹 쿼리를 위해 메타데이터 추가
  const addinfoTableEntity = getAddinfoEntityByTableName(tableName)
  addMetadata(connection, addinfoTableEntity)

  const existingData = await connection.manager.findOne(addinfoTableEntity, {
    manage_number: inputData.manage_number,
  })

  if (changeReasonCode === '31') {
    if (!existingData) connection.manager.save(addinfoTableEntity, inputData, { reload: false })
  } else if (changeReasonCode === '34') {
    if (!existingData) connection.manager.save(addinfoTableEntity, inputData, { reload: false })
    else
      connection.manager.update(
        addinfoTableEntity,
        { manage_number: inputData.manage_number },
        inputData
      )
  } else {
    if (existingData)
      connection.manager.delete(addinfoTableEntity, {
        manage_number: inputData.manage_number,
      })
  }
}
