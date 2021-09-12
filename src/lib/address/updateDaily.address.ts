import { createReadStream, readdirSync } from 'fs'
import { dailyDir } from '../path'
import { createInterface } from 'readline'
import { getDbConnection } from '../../typeorm/connection'
import { updateRoadcodeTable } from './update/update.roadcode'
import { roadcodeUpdateEvent } from './address.event'
import { getMysqlPoolConnection } from '../mysqlConnection'

const entries = readdirSync(dailyDir)

export async function updateDailyAddress(date: string) {
  const connection = await getMysqlPoolConnection()
  // const connection = await getDbConnection()
  const [roadcodeFile] = entries.filter(entry => entry.includes(date) && entry.includes('ROAD'))

  const rl = createInterface({
    input: createReadStream(dailyDir + '/' + roadcodeFile),
    crlfDelay: Infinity,
  })

  // 도로명코드 한줄마다 업데이트 실행
  rl.on('line', async data => {
    await updateRoadcodeTable(connection, data)
  })

  // 종료시 같은 일자의 테이블도 업데이트
  rl.on('close', () => {
    roadcodeUpdateEvent.emit('doAfterRoadcodeUpdate', connection, date)
  })
}
