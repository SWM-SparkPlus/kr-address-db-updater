import { createReadStream, readdirSync } from 'fs'
import { dailyDir } from '../../path'
import { createInterface } from 'readline'
import { updateRoadcodeTable } from './update.roadcode'
import { roadcodeUpdateEvent } from '../address.events'
import { getMysqlPoolConnection } from '../../mysqlConnection'

const entries = readdirSync(dailyDir)

export async function updateAccumulationAddress() {
  const roadcodeFiles = entries.filter(entry => entry.includes('ROAD'))

  for (const filename of roadcodeFiles) {
    const connection = await getMysqlPoolConnection()
    const rl = createInterface({
      input: createReadStream(dailyDir + '/' + filename),
      crlfDelay: Infinity,
    })

    // 도로명코드 한줄마다 업데이트 실행
    rl.on('line', data => {
      updateRoadcodeTable(connection, data)
    })

    // 종료시 같은 일자의 테이블도 업데이트
    rl.on('close', () => {
      connection.release()
      roadcodeUpdateEvent.emit('doAfterRoadcodeUpdate', filename.split('.')[2])
    })
  }
}
