import dayjs from 'dayjs'
import { logger } from '../logger'
import { downloadAndWriteAddressFiles } from './download.address'
import { updateDailyAddress } from './updateDaily.address'

export async function updateAccumulatedDailyAddress(entry: string) {
  try {
    // 오늘을 기준으로 업데이트 해야할 기간 지정.
    const today = dayjs(new Date()).format('YYYYMMDD')
    const yyyymm = today.slice(0, 6)
    const todayDD = today.slice(6)

    const passedDays = Array.from({ length: +todayDD }, (_, i) => i + 1).map(x => {
      if (x < 10) return yyyymm + '0' + x.toString()

      return yyyymm + x.toString()
    })

    // console.log(passedDays)

    // 다운로드 시작하며 끝났을 때 업데이트 실행
    for (const day of passedDays) {
      await downloadAndWriteAddressFiles(day)
    }

    // 업데이트 기준 시간은 UTC 00시
  } catch (err) {
    logger.error(`[UpdateAccumulateAddressError] ${err}`)
    console.error(`[UpdateAccumulateAddressError] ${err}`)
  }
}
