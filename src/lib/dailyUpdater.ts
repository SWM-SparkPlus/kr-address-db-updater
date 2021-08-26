import { prismaClient } from '../prisma/prismaClient'
import { createReadStream, readdirSync } from 'fs'
import { dailyDir } from './projectPath'
import { createInterface } from 'readline'
import { logger } from './logger'
import { prisma, Prisma } from '@prisma/client'
import {
  TAddInfoTableName,
  TAddInfoTableSchema,
  TJibunTableSchema,
  TRoadnameTableSchema,
} from './sido'
import { getAddinfoEntityByTableName } from '../typeorm/entities/addinfo.entity'
import { getRoadnameCodeEntity, RoadcodeEntity } from '../typeorm/entities/roadcode.entity'
import { Connection, getManager, getRepository } from 'typeorm'

const entries = readdirSync(dailyDir)

async function dailyUpdate() {
  for (const entry of entries) {
    const rl = createInterface({
      input: createReadStream(dailyDir + '/' + entry),
      crlfDelay: Infinity,
    })

    // let changeReasonCode: string = ''
    // let tablename: string = ''

    // if (entry.includes('ADDINFO')) {
    //   // 부가정보 업데이트
    //   rl.on('line', async data => {
    //     const splitData = data.split('|')
    //     changeReasonCode = splitData[9]

    //     const inputData: TAddInfoTableSchema = {
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

    //     try {
    //       const findResult = await prismaClient.addinfo_manage_number_index.findFirst({
    //         where: {
    //           manage_number: splitData[0],
    //         },
    //         select: {
    //           tablename: true,
    //         },
    //       })

    //       console.log('findResult', findResult, changeReasonCode)

    //       tablename = findResult?.tablename as TAddInfoTableName
    //     } catch (err) {
    //       throw err
    //     }

    //     try {
    //       const entity = createAddinfoEntity(tablename)
    //       const connectionA = await connectionService.getConnection(entity)
    //       const repository = connectionA.getRepository(entity)
    //       const test = await repository.findOne()
    //       console.log(test)

    //       // if (changeReasonCode === '31') {
    //       //   await prismaClient[tablename as TAddInfoTableName].create({
    //       //     data: data as TJibunTableSchema,
    //       //   })
    //       // } else if (changeReasonCode === '34') {
    //       //   await prismaClient[tablename as TAddInfoTableName].update({
    //       //     where: { manage_number: inputData.manage_number },
    //       //     data: data as TJibunTableSchema,
    //       //   })
    //       // } else if (changeReasonCode === '63') {
    //       //   await prismaClient[tablename as TAddInfoTableName].delete({
    //       //     where: { manage_number: inputData.manage_number },
    //       //   })
    //       // }
    //     } catch (err) {
    //       console.error(err)
    //       process.exit(1)
    //       throw err
    //     } finally {
    //       prismaClient.$disconnect()
    //     }
    //   })
    // }

    // else if (entry.includes('JIBUN')) {
    //   // 지번주소 업데이트
    //   rl.on('line', async data => {
    //     const splitData = data.split('|')
    //     changeReasonCode = splitData[11]

    //     const inputData: TJibunTableSchema = {
    //       manage_number: splitData[0],
    //       serial_number: +splitData[1],
    //       bupjungdong_code: splitData[2],
    //       sido_name: splitData[3],
    //       sigungu_name: splitData[4],
    //       bupjung_eupmyeondong_name: splitData[5],
    //       bupjunglee_name: splitData[6],
    //       is_mountain: splitData[7],
    //       jibun_primary: +splitData[8],
    //       jibun_secondary: +splitData[9],
    //       is_representation: splitData[10],
    //     }

    //     const findResult = await prismaClient.jibun_manage_number_index.findFirst({
    //       where: {
    //         manage_number: splitData[0],
    //       },
    //       select: {
    //         tablename: true,
    //       },
    //     })

    //     tablename = findResult?.tablename as TAddInfoTableName

    //     try {
    //       if (changeReasonCode === '31') {
    //         await prismaClient[tablename as TAddInfoTableName].create({
    //           data: data as TJibunTableSchema,
    //         })
    //       } else if (changeReasonCode === '34') {
    //         await prismaClient[tablename as TAddInfoTableName].update({
    //           where: { manage_number: inputData.manage_number },
    //           data: data as TJibunTableSchema,
    //         })
    //       } else if (changeReasonCode === '63') {
    //         await prismaClient[tablename as TAddInfoTableName].delete({
    //           where: { manage_number: inputData.manage_number },
    //         })
    //       }
    //     } catch (err) {
    //       throw err
    //     }
    //   })
    // }
    // else if (entry.includes('JUSO')) {
    //   // 도로명주소 업데이트
    //   rl.on('line', async data => {
    //     const splitData = data.split('|')
    //     changeReasonCode = splitData[10]

    //     const inputData: TRoadnameTableSchema = {
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

    //     const findResult = await prismaClient.juso_manage_number_index.findFirst({
    //       where: {
    //         manage_number: splitData[0],
    //       },
    //       select: {
    //         tablename: true,
    //       },
    //     })

    //     tablename = findResult?.tablename as string

    //     try {
    //       if (changeReasonCode === '31') {
    //         await prismaClient[tablename as TAddInfoTableName].create({
    //           data: data as TJibunTableSchema,
    //         })
    //       } else if (changeReasonCode === '34') {
    //         await prismaClient[tablename as TAddInfoTableName].update({
    //           where: { manage_number: inputData.manage_number },
    //           data: data as TJibunTableSchema,
    //         })
    //       } else if (changeReasonCode === '63') {
    //         await prismaClient[tablename as TAddInfoTableName].delete({
    //           where: { manage_number: inputData.manage_number },
    //         })
    //       }
    //     } catch (err) {
    //       throw err
    //     }
    //   })
    // }

    if (entry.includes('MATCHING_ROAD')) {
      // 도로명코드 업데이트
      rl.on('line', async data => {
        const splitData = data.split('|')

        // inputData.rao{
        //   roadname_code: splitData[0],
        //   roadname: splitData[1],
        //   roadname_eng: splitData[2],
        //   eupmyeondong_number: splitData[3],
        //   sido_name: splitData[4],
        //   sido_eng: splitData[5],
        //   sigungu: splitData[6],
        //   sigungu_eng: splitData[7],
        //   eupmyeondong: splitData[8],
        //   eupmyeondong_eng: splitData[9],
        //   eupmyeondong_type: splitData[10],
        //   eupmyeondong_code: splitData[11],
        //   is_using: splitData[12],
        //   change_reason: splitData[13],
        //   change_history: splitData[14],
        //   declare_date: splitData[15],
        //   expire_date: splitData[16],
        // }

        const connection: Connection = await getConnection(connectionOption)
        console.log(connection)

        try {
          const repo = await connection.createQueryRunner()
          console.log(repo.findOne(1))
          // if (inputData.change_history === '신규') {
          // }
          //  else {
          //   await prismaClient.roadname_code.update({
          //     where: {
          //       roadname_code_eupmyeondong_number: {
          //         roadname_code: inputData.roadname_code,
          //         eupmyeondong_number: inputData.eupmyeondong_number,
          //       },
          //     },
          //     data: inputData
          //   })
          // }
        } catch (e) {
          console.error(e)
          throw e
        } finally {
          await connection.close()
        }
      })
    }
  }
}

dailyUpdate()
  .then(() => {
    logger.info('Job finished.')
  })
  .catch(e => logger.error(e))
