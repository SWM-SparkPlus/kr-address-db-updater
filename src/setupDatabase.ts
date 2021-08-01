import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'
import './lib/env'
import { logger } from './lib/logger'
import EventEmitter from 'events'
import { downloadFile, TDownloadFileOption } from './lib/fileDownloader'

const eventEmitter = new EventEmitter()
eventEmitter.setMaxListeners(100)

console.warn(
  `[HeavyJobWarning] !!! This job contains cpu intensive workload such as string encode/decode and high network usage !!!`
)

// 전월 구하기
const date = new Date()
const previousMonth = dayjs(date.setMonth(date.getMonth() - 3)).format('YYYYMM')

logger.info(`[DownloadInfo] This job will download total data based on date '${previousMonth}'`)

// 요청주소. 최신 주소 DB
const url = encodeURI(
  `https://www.juso.go.kr/dn.do?reqType=ALLMTCHG&regYmd=${previousMonth.slice(
    0,
    4
  )}&ctprvnCd=00&gubun=MTCH&stdde=${previousMonth}&fileName=${previousMonth}_주소DB_전체분.zip&realFileName=${previousMonth}ALLMTCHG00.zip&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
)

const rootDir = path.resolve(__dirname + '/..')
const resourceDir = `${rootDir}/resources/total`
// 파일이름, 디렉토리명, WriteStream 생성
const fileName = `${previousMonth}_total.zip`
const zipPath = `${resourceDir}/${fileName}`

// 클린 다운로드를 위해 기존 리소스 삭제
if (fs.existsSync(resourceDir)) {
  try {
    fs.rmSync(resourceDir, { recursive: true, force: true })
    fs.mkdirSync(resourceDir, { recursive: true })
    logger.info(`[DownloadPreparation] Cleaning resource directory completed.`)
  } catch (err) {
    logger.error(`[DownloadPreparationError] ${err}`)
    process.exit(1)
  }
}

const downdloadStream = fs.createWriteStream(zipPath)
const downloadOption: TDownloadFileOption = {
  url,
  writeStream: downdloadStream,
  downloadDir: resourceDir,
}

// 다운로드 실행
const main = async () => {
  try {
    await downloadFile(downloadOption)
  } catch (err) {
    logger.error(`[DownloadError] ${err}`)
    fs.rmSync(resourceDir, { force: true, recursive: true })
    process.exit(1)
  }
}

main().catch(e => {
  console.error('망함!' + e)
})
