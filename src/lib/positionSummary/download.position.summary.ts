import dayjs from 'dayjs'
import { createWriteStream, rmSync } from 'fs'
import { TDownloadFileOption } from '../../types/option.type'
import { downloadFileAndGetEntries } from '../downloadAndGetEntries'
import { logger } from '../logger'
import { monthlyDir, totalDir } from '../path'
import { writePositionSummaryAndImport } from './write.position.summary'

/**
 * 위치정보 요약본을 다운로드하고 파일로 기록하며 Database import 작업을 위임하는 함수
 *
 * @param downloadFlag 다운로드 형태. total(전체분), monthly(월간 변동분) 택 1
 */
export async function downloadPositionSummary(
  downloadFlag: string,
  doImport?: boolean,
  doDailyUpdate?: boolean
) {
  const date = new Date()
  let url = ''
  let downloadDir = ''

  const previousMonth = dayjs(date.setMonth(date.getMonth() - 2)).format('YYYYMM')
  const year = previousMonth.slice(0, 4)
  const yymm = year.slice(2, 4) + previousMonth.slice(4, 6)

  logger.info(`[PREPARATION] Start on ${date}, download based on ${previousMonth}`)

  // 매개변수에 따라 다르게 처리
  if (downloadFlag === 'total') {
    logger.info(`[DOWNLOAD_TOTAL_POSITION_SUMMARY_START]`)

    url = encodeURI(
      `https://www.juso.go.kr/dn.do?boardId=GEODATA&regYmd=${year}&num=63&fileNo=90652&stdde=${previousMonth}&fileName=${previousMonth}_위치정보요약DB_전체분.zip&realFileName=ENTRC_DB_${yymm}.zip&logging=Y&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
    )
    downloadDir = totalDir
  } else if (downloadFlag === 'monthly') {
    logger.info(`[DOWNLOAD_POSITION_SUMMARY_MONTHLY_UPDATE_START]`)

    url = encodeURI(
      `https://www.juso.go.kr/dn.do?boardId=GEOMOD&regYmd=${year}&num=48&fileNo=90653&stdde=${previousMonth}&fileName=${previousMonth}_위치정보요약DB_변동분.zip&realFileName=ENTRC_DB_MOD_${yymm}.zip&logging=Y&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
    )
    downloadDir = monthlyDir
  }

  const writeStream = createWriteStream(`${downloadDir}/pos_summary_DB.zip`)
  ;(await downloadFileAndGetEntries({ url, writeStream } as TDownloadFileOption)).forEach(entry => {
    entry.getDataAsync((data, err) => {
      if (err) throw err

      writePositionSummaryAndImport({
        data,
        entryOfZip: entry,
        writeDir: downloadDir,
        doImport: false,
        doDailyUpdate: false,
      })
    })
  })

  rmSync(writeStream.path)
}
