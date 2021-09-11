import dayjs from 'dayjs'
import { logger } from '../logger'
import { downloadAndWriteAddressFiles } from './download.address'
import { updateDailyAddress } from './updateDaily.address'

export async function updateAccumulatedDailyAddress() {
  // 오늘을 기준으로 업데이트 해야할 기간 지정.
  const yesterday = '20210910'
  // const yesterday = dayjs(new Date()).subtract(1, 'day').format('YYYYMMDD')
  const yyyymm = yesterday.slice(0, 6)
  const yesterdayDD = yesterday.slice(6)

  const passedDays = Array.from({ length: +yesterdayDD }, (_, i) => i + 1).map(x => {
    if (x < 10) return yyyymm + '0' + x.toString()

    return yyyymm + x.toString()
  })

  try {
    for (const day of passedDays) {
      await downloadAndWriteAddressFiles({ targetDate: day, doDailyUpdate: true })
    }
  } catch (err) {
    logger.error(`[DAILY_UPDATE_ACCUMULATION_ERROR] ${err}`)
    console.error(`[DAILY_UPDATE_ACCUMULATION_ERROR] ${err}`)
  }
}
