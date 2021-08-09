import dayjs from 'dayjs'
import { rmSync, createWriteStream } from 'fs'
import './lib/env'
import { logger } from './lib/logger'
import { downloadFileAndGetEntries, TDownloadFileOption } from './lib/fileDownloader'
import { writeEncodedFileAndImport } from './lib/utf8Writer'
import { totalDir } from './lib/projectPath'
import { downloadPathHandler } from './lib/pathHandler'

downloadPathHandler()

console.warn(
  `[HeavyJobWarning] !!! This job contains cpu intensive workload such as string encode/decode and high network usage !!!`
)

// 전월 구하기
const date = new Date()
const previousMonth = dayjs(date.setMonth(date.getMonth() - 2)).format('YYYYMM')

logger.info(`[DownloadInfo] This job will download total data based on date '${previousMonth}'`)

// 요청주소. 최신 주소 DB
const url = encodeURI(
  `https://www.juso.go.kr/dn.do?reqType=ALLMTCHG&regYmd=${previousMonth.slice(
    0,
    4
  )}&ctprvnCd=00&gubun=MTCH&stdde=${previousMonth}&fileName=${previousMonth}_주소DB_전체분.zip&realFileName=${previousMonth}ALLMTCHG00.zip&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
)

const downloadDir = totalDir
const fileName = `${previousMonth}_total.zip`
const zipPath = `${downloadDir}/${fileName}`

const downdloadStream = createWriteStream(zipPath)
const downloadOption: TDownloadFileOption = {
  url,
  writeStream: downdloadStream,
}

// 다운로드 실행
const main = async () => {
  try {
    // 다운로드
    const zipEntries = await downloadFileAndGetEntries(downloadOption)

    // 인코딩
    zipEntries.forEach(entry => {
      entry.getDataAsync((data, err) => {
        if (err) throw err

        writeEncodedFileAndImport({
          data,
          entryOfZip: entry,
          writeDir: downloadDir,
          doImport: true,
        })
      })
    })

    rmSync(zipPath)
  } catch (err) {
    rmSync(downloadDir, { force: true, recursive: true })
    throw err
  }
}

main().catch(e => {
  logger.error(`[SetupDatabaseError] ${e}`)
})
