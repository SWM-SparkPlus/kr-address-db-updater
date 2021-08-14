import {
  createOne,
  deleteOnyByManageNumber,
  prismaClient,
  updateOnyByManageNumber,
} from '../prisma/prismaClient'
import { createReadStream, readdirSync, readSync } from 'fs'
import { dailyDir } from './projectPath'
import { createInterface } from 'readline'
import { logger } from './logger'
import { Prisma } from '@prisma/client'
import { TAddInfoTableSchema, TIntegratedTableName, TIntegratedTableSchema } from './sido'

const entries = readdirSync(dailyDir)

async function dailyUpdate() {
  for (const entry of entries) {
    const rl = createInterface({
      input: createReadStream(dailyDir + '/' + entry),
      crlfDelay: Infinity,
    })

    let tablePrefix = ''
    let tablePostfix = ''
    let changeReasonCode = ''
    let inputData: TIntegratedTableSchema = undefined

    if (entry.includes('ADDINFO')) {
      tablePrefix = 'additional_info'

      rl.on('line', async data => {
        const splitData = data.split('|')
        changeReasonCode = splitData[9]

        inputData = {
          manage_number: splitData[0],
          hangjungdong_code: splitData[1],
          hangjungdong_name: splitData[2],
          zipcode: splitData[3],
          zipcode_serial_number: splitData[4],
          bulk_delivery_building_name: splitData[5],
          master_building_name: splitData[6],
          sigungu_building_name: splitData[7],
          is_apt: splitData[8],
        }

        // 관리번호 기반으로 어떤 테이블인지 먼저 확인하고
        tablePostfix = 'jeju'
      })
    } else if (entries.includes('JIBUN')) {
      tablePrefix = 'jibun_address'

      rl.on('line', async data => {
        const splitData = data.split('|')
        changeReasonCode = splitData[9]

        inputData = {
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
      })
    } else if (entries.includes('JUSO')) {
      tablePrefix = 'roadname_address'

      rl.on('line', async data => {
        const splitData = data.split('|')
        changeReasonCode = splitData[9]

        inputData = {
          manage_number: splitData[0],
          roadname_code: splitData[1],
          eupmyeondong_number: splitData[2],
          basement: splitData[3],
          building_primary_number: +splitData[4],
          building_secondary_number: +splitData[5],
          basic_area_number: splitData[6],
          change_reason_code: splitData[7],
          notice_date: splitData[8],
          previous_roadname_address: splitData[9],
          has_detail: splitData[10],
        }
      })
    } else if (entries.includes('ROAD')) {
      rl.on('line', async data => {
        const splitData = data.split('|')

        const inputData: Prisma.roadname_codeCreateInput = {
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

        try {
          await prismaClient.roadname_code.upsert({
            where: {
              roadname_code_eupmyeondong_number: {
                roadname_code: inputData.roadname_code,
                eupmyeondong_number: inputData.eupmyeondong_code as string,
              },
            },
            update: inputData,
            create: inputData,
          })
          return
        } catch (e) {
          throw e
        }
      })
    }

    const tableName = (tablePrefix + '_' + tablePostfix) as TIntegratedTableName

    try {
      if (changeReasonCode === '31') {
        await createOne(tableName, inputData)
      } else if (changeReasonCode === '34') {
        await updateOnyByManageNumber(tableName, inputData.manage_number, inputData)
      } else if (changeReasonCode === '63') {
        await deleteOnyByManageNumber(tableName, inputData.manage_number, inputData)
      }
    } catch (err) {
      throw err
    }
  }
}

dailyUpdate()
  .then(() => {
    logger.info('Job finished.')
  })
  .catch(e => logger.error(e))
