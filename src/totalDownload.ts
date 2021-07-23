import dayjs from 'dayjs'
import https from 'https'
import fs from 'fs'
import path from 'path'
import extract from 'extract-zip'
import iconv from 'iconv-lite'
import { logger } from './lib/logger'

console.warn(
  `TotalDatabaseDownloadWarning] !!! This job contains cpu intensive workload such as string encode/decode and high network usage !!!`
)

// 전월 구하기
const date = new Date()
const previousMonth = dayjs(date.setMonth(date.getMonth() - 1)).format('YYYYMM')

// 요청주소. 최신 주소 DB
const url = encodeURI(
  `https://www.juso.go.kr/dn.do?reqType=ALLMTCHG&regYmd=${previousMonth.slice(
    0,
    4
  )}&ctprvnCd=00&gubun=MTCH&stdde=${previousMonth}&fileName=${previousMonth}_주소DB_전체분.zip&realFileName=${previousMonth}ALLMTCHG00.zip&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
)

const rootDir = path.resolve(__dirname + '/..')
const resourcePath = `${rootDir}/resources`

// 클린 다운로드를 위해 기존 리소스 삭제
if (fs.existsSync(resourcePath)) {
  try {
    fs.rmSync(resourcePath, { recursive: true, force: true })
    logger.info(`[TotalDatabaseDownloadPreparation] Resource directory deletion completed.`)
  } catch (err) {
    logger.error(`[TotalDatabaseDownloadPreparation] ${err}`)
    process.exit(1)
  }
}

// 디렉토리 생성
try {
  fs.mkdirSync(resourcePath)
  logger.info(`[TotalDatabaseDownloadPreparation] Make directory successfully.`)
} catch (err) {
  logger.error(`[TotalDatabaseDownloadPreparation] ${err}`)
  process.exit(1)
}

// 파일이름, 디렉토리명, WriteStream 생성
const fileName = `${previousMonth}_total.zip`
const zipPath = `${resourcePath}/${fileName}`
const writeStream = fs.createWriteStream(zipPath)

// 다운로드 액션
https.get(url, res => {
  if (res.statusCode)
    // 다운로드 데이터를 쓰기스트림에 파이프라이닝
    res.pipe(writeStream)

  // 스트림 입력 종료시에 압축 해제
  writeStream.on('finish', async () => {
    try {
      await extract(zipPath, { dir: resourcePath })
    } catch (err) {
      // zip 파일이 아니거나, 온전하지 못하거나, 날짜에 맞는 파일을 다운받지 못했을 경우 에러 발생
      logger.error(`[ZipExtractError] ${err}`)
      fs.rmSync(resourcePath, { force: true, recursive: true })
      process.exit(1)
    }

    // 압축해제 후 삭제
    try {
      fs.rmSync(zipPath)
    } catch (err) {
      logger.error(`[ZipFileRemoveError] ${err}`)
      process.exit(1)
    }

    // 파일리스트
    const eucKrFiles = fs.readdirSync(resourcePath)

    eucKrFiles.forEach(fileName => {
      if (path.extname(`${resourcePath}/${fileName}`) !== '.txt') {
        return
      }
      const euckrContent = fs.readFileSync(`${resourcePath}/${fileName}`)
      // euc-kr 로 decode
      const utf8EncodedContent = iconv.decode(euckrContent, 'euc-kr')
      // utf8로 async overwrite
      fs.writeFile(`${resourcePath}/${fileName}`, utf8EncodedContent, err => {
        if (err) {
          logger.error(`[UTF8ConversionError] ${err.message} ${err.stack}`)
          process.exit(1)
        }
      })
      logger.info(`[UTF8FileConversion] Successfully convert ${fileName} encoding EUC-KR to UTF8.`)
    })

    logger.info(`[TotalDatabaseDownloadCompletion] Job finished!`)
  })
})
