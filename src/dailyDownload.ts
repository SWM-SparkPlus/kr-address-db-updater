import dayjs from 'dayjs'
import https from 'https'
import fs from 'fs'
import path from 'path'
import extract from 'extract-zip'
import iconv from 'iconv-lite'
import { logger } from './lib/logger'

// 어제 날짜 구하기
const date = new Date()
const yesterday = dayjs(date.setDate(date.getDate() - 1)).format('YYYYMMDD')

// 요청 주소(어제자 일일 변경분)
const url = encodeURI(
  `https://www.juso.go.kr/dn.do?reqType=DC&stdde=${yesterday}&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
)

const rootDir = path.resolve(__dirname + '/..')
const targetPath = `${rootDir}/resources/daily`

// 클린 다운로드를 위해 기존 리소스 삭제
if (fs.existsSync(targetPath)) {
  try {
    fs.rmSync(targetPath, { recursive: true, force: true })
    logger.info(`[DailyUpdatePreparation] Resource directory deletion completed.`)
  } catch (err) {
    logger.error(`[DailyUpdatePreparation] ${err}`)
    process.exit(1)
  }
}

// 디렉토리 생성
try {
  fs.mkdirSync(targetPath, { recursive: true })
  logger.info(`[DailyUpdatePreparation] Make directory successfully.`)
} catch (err) {
  logger.error(`[DailyUpdatePreparation] ${err}`)
  process.exit(1)
}

// 파일이름, 디렉토리명, WriteStream 생성
const fileName = `${yesterday}_update.zip`
const zipPath = `${targetPath}/${fileName}`
const writeStream = fs.createWriteStream(zipPath)

// 변경분 다운로드
https.get(url, res => {
  if (res.statusCode)
    // 다운로드 데이터를 쓰기스트림에 파이프라이닝
    res.pipe(writeStream)

  // 스트림 입력 종료시에 압축 해제
  writeStream.on('finish', async () => {
    try {
      await extract(zipPath, { dir: targetPath })
    } catch (err) {
      // zip 파일이 아니거나, 온전하지 못하거나, 날짜에 맞는 파일을 다운받지 못했을 경우 에러 발생
      logger.error(`[ZipExtractError] ${err}`)
      fs.rmSync(targetPath, { force: true, recursive: true })
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
    const eucKrFiles = fs.readdirSync(targetPath)

    eucKrFiles.forEach(fileName => {
      const euckrContent = fs.readFileSync(`${targetPath}/${fileName}`)
      // euc-kr 로 decode
      const utf8EncodedContent = iconv.decode(euckrContent, 'euc-kr')
      // utf8로 async overwrite
      fs.writeFile(`${targetPath}/${fileName}`, utf8EncodedContent, err => {
        if (err) {
          logger.error(`[UTF8ConversionError] ${err.message} ${err.stack}`)
          process.exit(1)
        }
      })
      logger.info(
        `[UTF8ConversionCompletion] Successfully convert ${fileName} encoding EUC-KR to UTF8.`
      )
    })

    logger.info(`[DailyDownloadCompletion] Job finished!`)
  })
})
