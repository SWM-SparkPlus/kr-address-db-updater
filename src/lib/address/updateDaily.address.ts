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

const roadcodeFinishEvent = new EventEmitter().on('finish', async (date: string) => {
  try {
    const connection: Connection = await getDbConnection()
    // 일자가 동일하고 도로명코드가 아닌 데이터 핕터링
    const sameDateEntries = entries.filter(entry => entry.includes(date) && !entry.includes('ROAD'))

    // TypeORM 쿼리 위임
    for (const entry of sameDateEntries) {
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
    }
  } catch (err) {
    logger.error(`[QueryAfterRoadcodeError] ${err}`)
  }
})

export async function updateDailyAddress(date: string) {
  const connection = await getDbConnection()
  const [roadcodeFile] = entries.filter(entry => entry.includes(date) && entry.includes('ROAD'))

  const rl = createInterface({
    input: createReadStream(dailyDir + '/' + roadcodeFile),
    crlfDelay: Infinity,
  })

  rl.on('line', async data => {
    await updateRoadcodeTable(connection, data)
  })

  // 종료시 같은 일자의 테이블도 업데이트
  rl.on('close', () => {
    roadcodeFinishEvent.emit('finish', date)
  })
}

// try {
//   ;(async () => {
//     const connection = await getDbConnection()

//     for (const entry of entries) {
//       const rl = createInterface({
//         input: createReadStream(dailyDir + '/' + entry),
//         crlfDelay: Infinity,
//       })

//       // 도로명코드 우선 처리
//       if (entry.includes('ROAD')) {
//         // 도로명코드와 동일한 일자에 해당하는 일일 업데이트 이벤트 발행
//         rl.on('line', async data => {
//           await updateRoadcodeTable(connection, data)
//         })

//         // 처리한 도로명코드 일일 변동분과 동일한 일자의 파일들 업데이트 실행
//         rl.on('close', () => {
//           roadcodeFinishEvent.emit('finish', entry)
//         })
//       }
//     }
//   })()
// } catch (err) {
//   logger.error(err)
//   console.error(err)
// }
