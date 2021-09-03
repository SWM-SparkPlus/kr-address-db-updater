import { createReadStream, readdirSync } from 'fs'
import { dailyDir } from '../path'
import { createInterface } from 'readline'
import { logger } from '../logger'
import { getDbConnection } from '../../typeorm/connection'
import { EventEmitter } from 'stream'
import { updateAddinfoTable } from './update/update.addinfo'
import { Connection } from 'typeorm'
import { updateJusoTable } from './update/update.juso'
import { updateJibunTable } from './update/update.jibun'
import { updateRoadcodeTable } from './update/update.roadcode'

const entries = readdirSync(dailyDir)

const roadcodeFinishEvent = new EventEmitter()
  .setMaxListeners(0)
  .on('finish', async (entryName: string) => {
    try {
      const connection: Connection = await getDbConnection()
      // 변경분 일자 추출
      const updateDate = entryName.split('.')[2]
      // 변경분 일자에 해당하고 도로명 코드가 아닌 파일만 추출
      const targetEntries = entries.filter(
        entry => entry.includes(updateDate) && !entry.includes('ROAD')
      )

      // TypeORM 쿼리 위임
      for (const entry of targetEntries) {
        const rl = createInterface({
          input: createReadStream(dailyDir + '/' + entry),
          crlfDelay: Infinity,
        })

        if (entry.includes('ADDINFO')) {
          rl.on('line', data => {
            updateAddinfoTable(connection, data)
          })
        } else if (entry.includes('JUSO')) {
          rl.on('line', data => {
            updateJusoTable(connection, data)
          })
        }
        if (entry.includes('JIBUN')) {
          rl.on('line', data => {
            updateJibunTable(connection, data)
          })
        }
      }
    } catch (err) {
      logger.error(`[QueryAfterRoadcodeError] ${err}`)
    }
  })

try {
  ;(async () => {
    const connection = await getDbConnection()

    for (const entry of entries) {
      const rl = createInterface({
        input: createReadStream(dailyDir + '/' + entry),
        crlfDelay: Infinity,
      })

      // 도로명코드 우선 처리
      if (entry.includes('ROAD')) {
        // 도로명코드와 동일한 일자에 해당하는 일일 업데이트 이벤트 발행
        rl.on('line', async data => {
          await updateRoadcodeTable(connection, data)
        })

        rl.on('close', () => {
          roadcodeFinishEvent.emit('finish', entry)
        })
      }
    }
  })()
} catch (err) {
  logger.error(err)
  console.error(err)
}
