import { createReadStream, readdirSync } from 'fs'
import { dailyDir } from './projectPath'
import { createInterface } from 'readline'
import { logger } from './logger'
import {
  SidoObject,
  TAddInfoTableName,
  TAddInfoTableSchema,
  TIndexTableName,
  TJibunTableName,
  TRoadnameTableName,
  TSido,
  TSidoObject,
} from './sido'
import { getAddinfoEntityByTableName } from '../typeorm/entities/addinfo.entity'
import { getConnection } from '../typeorm/connection'
import { ormConfig } from '../typeorm/ormConfig'
import { addMetadata } from '../typeorm/addMetadata'
import { getManageNumberIndexTableName } from '../typeorm/entities/manageNumber.index.entity'
import { getJibunEntityByTableName } from '../typeorm/entities/jibun.entity'
import { getJusoEntityByTableName } from '../typeorm/entities/juso.entity'
import { JusoModel } from '../models/juso.model'
import { JibunModel } from '../models/jibun.model'
import { AddInfoModel } from '../models/addInfo.model'
import { RoadcodeEntity } from '../typeorm/entities/roadcode.entity'

const entries = readdirSync(dailyDir)

try {
  ;(async () => {
    const connection = await getConnection(ormConfig)

    for (const entry of entries) {
      const rl = createInterface({
        input: createReadStream(dailyDir + '/' + entry),
        crlfDelay: Infinity,
      })

      let changeReasonCode = ''

      // if (entry.includes('MATCHING_ADDINFO')) {
      //   // 부가정보
      //   rl.on('line', async data => {
      //     const splitData = data.split('|')
      //     const inputData: AddInfoModel = {
      //       manage_number: splitData[0],
      //       hangjungdong_code: splitData[1],
      //       hangjungdong_name: splitData[2],
      //       zipcode: splitData[3],
      //       zipcode_serial_number: splitData[4],
      //       bulk_delivery_building_name: splitData[5],
      //       master_building_name: splitData[6],
      //       sigungu_building_name: splitData[7],
      //       is_apt: splitData[8],
      //     }
      //     changeReasonCode = splitData[9]

      //     if (changeReasonCode === '31') {
      //       // 신규
      //     } else {
      //       // 수정 또는 삭제
      //       const addinfoIndexEntity = getManageNumberIndexTableName('addinfo_manage_number_index')
      //       addMetadata(connection, addinfoIndexEntity)
      //       const findIndex = await connection.manager.find(addinfoIndexEntity, {
      //         manage_number: inputData.manage_number,
      //       })

      //       const tableName = findIndex.pop()?.tablename as TAddInfoTableName
      //       const targetTableEntity = getAddinfoEntityByTableName(tableName)
      //       addMetadata(connection, targetTableEntity)

      //       if (changeReasonCode === '34') {
      //         connection.manager.update(
      //           targetTableEntity,
      //           { manage_number: inputData.manage_number },
      //           inputData
      //         )
      //       } else if (changeReasonCode === '63') {
      //         connection.manager.delete(targetTableEntity, {
      //           manage_number: inputData.manage_number,
      //         })
      //       }
      //     }
      //   })
      // }
      if (entry.includes('MATCHING_JIBUN')) {
        // 지번주소
        rl.on('line', async data => {
          const splitData = data.split('|')
          const inputData = {
            manage_number: splitData[0],
            serial_number: +splitData[1],
            bupjungdong_code: splitData[2],
            sido_name: splitData[3],
            sigungu_name: splitData[4],
            bupjung_eupmyeondong_name: splitData[5],
            bupjunglee_name: splitData[6],
            is_mountain: splitData[7],
            jibun_primary: +splitData[8],
            jibun_secondary: +splitData[9],
            is_representation: splitData[10],
          }

          changeReasonCode = splitData[11]

          // 인덱스 테이블 우선 조회
          const jibunIndexEntity = getManageNumberIndexTableName('jibun_manage_number_index')
          addMetadata(connection, jibunIndexEntity)
          const jibunTableNameIndex = await connection.manager.findOne(jibunIndexEntity, {
            manage_number: inputData.manage_number,
          })
          let updateTableName = jibunTableNameIndex?.tablename

          // 인덱스가 없을 경우 직접 생성
          if (!jibunTableNameIndex) {
            updateTableName = `jibun_address_${
              SidoObject[inputData.sido_name as TSido]
            }` as TJibunTableName
            connection.manager.save(
              jibunIndexEntity,
              { manage_number: inputData.manage_number, tablename: updateTableName },
              { reload: false }
            )
          }

          // 엔터티 생성 후 메터데이터 추가
          const jibunEntity = getJibunEntityByTableName(updateTableName as TJibunTableName)
          addMetadata(connection, jibunEntity)

          // 실제 일일 변동분 업데이트
          if (changeReasonCode in ['31', '34']) {
            connection.manager.save(jibunEntity, inputData, { reload: false })
          } else if (changeReasonCode === '63') {
            connection.manager.delete(jibunEntity, {
              manage_number: inputData.manage_number,
              serial_number: inputData.serial_number,
            })
          }

          // if (changeReasonCode === '31') {
          //   // 신규
          //   const tablePostfix = SidoObject[inputData.sido_name as TSido]
          //   const tableName = `jibun_address_${tablePostfix}` as TJibunTableName
          //   const targetEntity = getJibunEntityByTableName(tableName)
          //   const indexEntity = getManageNumberIndexTableName('jibun_manage_number_index')
          //   addMetadata(connection, targetEntity)
          //   addMetadata(connection, indexEntity)
          //   connection.manager.save(targetEntity, inputData, { reload: false })

          //   // 인덱스가 존재하지 않을 경우에만 인덱스 추가(기존 관리번호에 새로운 일련번호)
          //   const findIndex = await connection.manager.findOne(indexEntity, { manage_number: inputData.manage_number })
          //   if (!findIndex) connection.manager.save(indexEntity, { manage_number: inputData.manage_number, tablename: tableName }, { reload: false })
          // } else {
          //   // 수정 또는 삭제
          //   const jusoIndexEntity = getManageNumberIndexTableName('jibun_manage_number_index')
          //   addMetadata(connection, jusoIndexEntity)
          //   const findIndex = await connection.manager.findOne(jusoIndexEntity, {
          //     manage_number: inputData.manage_number,
          //   })

          //   const tableName = findIndex?.tablename as TJibunTableName

          //   // 인덱스가 없는 케이스 핸들링
          //   if (!tableName) {
          //     const areaName = SidoObject[inputData.sido_name as TSido]
          //     const targetTableName = `jibun_address_${areaName}`
          //     const newTargetEntity = getJibunEntityByTableName(targetTableName as TJibunTableName)
          //     addMetadata(connection, newTargetEntity)
          //     connection.manager.save(jusoIndexEntity, { manage_number: inputData.manage_number, tablename: targetTableName })
          //     connection.manager.save(newTargetEntity, inputData)
          //   }

          //   const targetTableEntity = getJibunEntityByTableName(tableName)
          //   addMetadata(connection, targetTableEntity)

          //   if (changeReasonCode === '34') {
          //     connection.manager.update(targetTableEntity, {
          //       manage_number: inputData.manage_number,
          //       serial_number: inputData.serial_number
          //     }, inputData)
          //   } else if (changeReasonCode === '63') {
          //     connection.manager.delete(targetTableEntity, {
          //       manage_number: inputData.manage_number,
          //       serial_number: inputData.serial_number
          //     })
          //   }
          // }
        })
      }
      // else if (entry.includes('MATCHING_JUSO')) {
      //   // 도로명주소
      //   rl.on('line', async data => {
      //     const splitData = data.split('|')
      //     const inputData: JusoModel = {
      //       manage_number: splitData[0],
      //       roadname_code: splitData[1],
      //       eupmyeondong_number: splitData[2],
      //       basement: splitData[3],
      //       building_primary_number: +splitData[4],
      //       building_secondary_number: +splitData[5],
      //       basic_area_number: splitData[6],
      //       change_reason_code: splitData[7],
      //       notice_date: splitData[8],
      //       previous_roadname_address: splitData[9],
      //       has_detail: splitData[10],
      //     }

      //     changeReasonCode = splitData[7]

      //     if (changeReasonCode === '31') {
      //       // 신규
      //       const findByCompositeKey = await connection.manager.find(RoadcodeEntity, {
      //         where: {
      //           roadname_code: inputData.roadname_code,
      //           eupmyeondong_code: inputData.eupmyeondong_number,
      //         },
      //       })
      //       const targetArea = findByCompositeKey.pop()?.eupmyeondong_eng.toLowerCase()
      //       const tableName = `roadname_address_${targetArea}` as TRoadnameTableName
      //       const targetEntity = getJusoEntityByTableName(tableName)

      //       addMetadata(connection, targetEntity)
      //       await connection.manager.save(targetEntity, inputData, {
      //         reload: false,
      //       })
      //     } else {
      //       // 수정 또는 삭제
      //       const jusoIndexEntity = getManageNumberIndexTableName('juso_manage_number_index')
      //       addMetadata(connection, jusoIndexEntity)
      //       const findIndex = await connection.manager.find(jusoIndexEntity, {
      //         manage_number: inputData.manage_number,
      //       })

      //       const tableName = findIndex.pop()?.tablename as TRoadnameTableName
      //       const targetTableEntity = getJusoEntityByTableName(tableName)
      //       addMetadata(connection, targetTableEntity)

      //       if (changeReasonCode === '34') {
      //         connection.manager.update(
      //           targetTableEntity,
      //           { manage_number: inputData.manage_number },
      //           inputData
      //         )
      //       } else if (changeReasonCode === '63') {
      //         connection.manager.delete(targetTableEntity, {
      //           manage_number: inputData.manage_number,
      //         })
      //       }
      //     }
      //   })
      // }
      // else if (entry.includes('MATCHING_ROAD')) {
      //   // 도로명코드
      //   rl.on('line', async data => {
      //     const splitData = data.split('|')
      //     const inputData: RoadcodeEntity = {
      //       roadname_code: splitData[0],
      //       roadname: splitData[1],
      //       roadname_eng: splitData[2],
      //       eupmyeondong_number: splitData[3],
      //       sido_name: splitData[4],
      //       sido_eng: splitData[5],
      //       sigungu: splitData[6],
      //       sigungu_eng: splitData[7],
      //       eupmyeondong: splitData[8],
      //       eupmyeondong_eng: splitData[9],
      //       eupmyeondong_type: splitData[10],
      //       eupmyeondong_code: splitData[11],
      //       is_using: splitData[12],
      //       change_reason: splitData[13],
      //       change_history: splitData[14],
      //       declare_date: splitData[15],
      //       expire_date: splitData[16],
      //     }

      //     const targetTableEntity = RoadcodeEntity

      //     if (inputData.change_history === '신규') {
      //       // 존재하지 않을 경우...
      //       connection.manager.save(targetTableEntity, inputData, { reload: false })
      //     } else {
      //       // 존재할 경우: 수정 또는 삭제
      //       connection.manager.update(
      //         targetTableEntity,
      //         {
      //           roadname_code: inputData.roadname_code,
      //           eupmyeondong_code: inputData.eupmyeondong_code,
      //         },
      //         inputData
      //       )
      //     }
      //   })
      // }
    }
  })()
} catch (err) {
  logger.error(err)
  console.error(err)
  process.exit(0)
} finally {
  process.exit(0)
}
