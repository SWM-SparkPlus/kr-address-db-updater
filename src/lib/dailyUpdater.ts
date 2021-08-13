import { prismaClient } from '../prisma/prismaClient'
import { createReadStream, readdirSync, readSync } from 'fs'
import { dailyDir } from './projectPath'
import { createInterface } from 'readline'
import { Prisma } from '@prisma/client'

const prisma = prismaClient

const entries = readdirSync(dailyDir)

for (const entry of entries) {
  const rl = createInterface({
    input: createReadStream(dailyDir + '/' + entry),
    crlfDelay: Infinity,
  })

  if (entry.includes('ADDINFO')) {
    rl.on('line', data => {
      const splitData = data.split('|')
      const addInfo: Prisma.additional_info_jejuCreateInput = {
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

      prisma.additional_info_jeju.upsert({
        where: { manage_number: addInfo.manage_number },
        update: addInfo,
        create: addInfo,
      })
    })
  } else if (entries.includes('JIBUN')) {
    rl.on('line', data => {
      const splitData = data.split('|')
      const addInfo: Prisma.jibun_address_jejuCreateInput = {
        manage_number: splitData[0],
        serial_number: +splitData[1],
        bupjungdong_code: splitData[2],
        sido_name: splitData[3],
        sigungu_name: splitData[4],
        bupjung_eupmyeondong_name: splitData[5],
        bupjunglee_name: splitData[6],
        is_mountain: splitData[7],
        jibun_primary: +splitData[9],
        jibun_secondary: +splitData[10],
        is_representation: splitData[11],
      }

      prisma.jibun_address_jeju.upsert({
        where: { manage_number: addInfo.manage_number },
        update: addInfo,
        create: addInfo,
      })
    })
  } else if (entries.includes('JUSO')) {
    rl.on('line', data => {
      const splitData = data.split('|')
      const addInfo: Prisma.roadname_address_jejuCreateInput = {
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

      prisma.roadname_address_jeju.upsert({
        where: { manage_number: addInfo.manage_number },
        update: addInfo,
        create: addInfo,
      })
    })
  } else if (entries.includes('ROAD')) {
    rl.on('line', data => {
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
        change_reason: splitData[12],
        change_history: splitData[12],
        declare_date: splitData[13],
        expire_date: splitData[13],
      }

      prisma.roadname_code.upsert({
        where: {
          roadname_code_eupmyeondong_number: {
            roadname_code: inputData.roadname_code,
            eupmyeondong_number: inputData.eupmyeondong_code,
          },
        },
        update: inputData,
        create: inputData,
      })
    })
  }
}
