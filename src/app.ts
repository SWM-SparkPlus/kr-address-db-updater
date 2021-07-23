import dayjs from 'dayjs'
import https from 'https'
import fs from 'fs'
import path from 'path'
import extract from 'extract-zip'
import iconv from 'iconv-lite'
import { logger } from './lib/logger'

// 어제 날짜 구하기
const yesterday = dayjs(new Date().setDate(new Date().getDate() - 2)).format('YYYYMMDD')

// 요청 주소(어제자 일일 변경분)
const url = `https://www.juso.go.kr/dn.do?reqType=DC&stdde=${yesterday}&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`

const rootDir = path.resolve(__dirname + '/..')
const resourcePath = `${rootDir}/resources`

// 디렉토리가 없을 경우 생성
if (fs.existsSync(resourcePath)) {
  try {
    fs.rmSync(resourcePath, { recursive: true, force: true })
    logger.info(`[DailyUpdatePreparation] Resource directory deletion completed`)
  } catch (err) { 
    logger.error(`[DailyUpdatePreparation] ${err}`)
    process.exit(1)
  }
}

try {
  fs.mkdirSync(resourcePath)
  logger.info(`[DailyUpdatePreparation] Make directory successfully`)
} catch (err) {
  logger.error(`[DailyUpdatePreparation] ${err}`)
  process.exit(1)
}

const fileName = `${yesterday}_update.zip`
const zipPath = `${resourcePath}/${fileName}`
const writeStream = fs.createWriteStream(zipPath)

// 변경분 다운로드
https.get(url, res => {
  // 다운로드 데이터를 쓰기스트림에 파이프라이닝
  res.pipe(writeStream)

  // 스트림 입력 종료시에 압축 해제
  writeStream.on('finish', async () => {
    await extract(zipPath, { dir: resourcePath })

    // 압축해제 후 삭제
    fs.rmSync(zipPath)

    // 파일리스트
    const eucKrFiles = fs.readdirSync(resourcePath)

    eucKrFiles.forEach(fileName => {
      const content = fs.readFileSync(`${resourcePath}/${fileName}`)
      // euc-kr 로 decode
      const utf8Content = iconv.decode(content, 'euc-kr')
      // utf8로 async overwrite
      fs.writeFile(`${resourcePath}/${fileName}`, utf8Content, (err) => {
        if (err) {
          logger.error(`[UTF8FileOverwriteError] ${err.message} ${err.stack}`)
        }
      })
      logger.info(`[UTF8FileOverWrite] Successfully convert ${fileName} encoding EUC-KR to UTF8.`)
    })
  })
})
