import EventEmitter from 'events'
import { createReadStream, readdirSync } from 'fs'
import { createInterface } from 'readline'
import { logger } from '../logger'
import { getMysqlPoolConnection } from '../mysqlConnection'
import { dailyDir } from '../path'
import { downloadPathHandler } from '../path/handler.path'
import { importToDb } from './importFile.address'
import { updateAddinfoTable } from './update/update.addinfo'
import { updateJibunTable } from './update/update.jibun'
import { updateJusoTable } from './update/update.juso'
import { updateDailyAddress } from './update/update.daily.address'

downloadPathHandler()
const entries = readdirSync(dailyDir)

export const fileDownloadEvent = new EventEmitter()
  .setMaxListeners(31)
  .on('finish', async (date: string) => {
    logger.info(`[DAILY_UPDATE_START] Update start on date ${date}`)
    await updateDailyAddress(date)
  })

export const roadcodeUpdateEvent = new EventEmitter().on(
  'doAfterRoadcodeUpdate',
  async (date: string) => {
    try {
      // 일자가 동일하고 도로명코드가 아닌 데이터 핕터링
      const sameDateEntries = entries.filter(
        entry => entry.includes(date) && !entry.includes('ROAD')
      )

      for (const entry of sameDateEntries) {
        const connection = await getMysqlPoolConnection()
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
        } else if (entry.includes('JIBUN')) {
          rl.on('line', data => {
            updateJibunTable(connection, data)
          })
        }

        rl.on('close', () => connection.release())
      }
    } catch (err) {
      logger.error(`[QUERY_AFTER_ROADCODE_ERROR] ${err}`)
    }
  }
)

export const afterWriteEvent = new EventEmitter()
  .setMaxListeners(0)
  .on('doImport', (tableName: string) => {
    importToDb(tableName)
  })
  .on('doDailyUpdate', (date: string) => {
    updateDailyAddress(date)
  })
