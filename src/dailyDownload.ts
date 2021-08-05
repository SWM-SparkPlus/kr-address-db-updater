import dayjs from 'dayjs'
import { existsSync, rmSync, mkdirSync, createWriteStream, writeFile } from 'fs'
import iconv from 'iconv-lite'
import { logger } from './lib/logger'
import { downloadFileAndGetEntries, TDownloadFileOption } from './lib/fileDownloader'
import { dailyDir } from './lib/projectPath'

// 어제 날짜 구하기
const date = new Date()
const yesterday = dayjs(date.setDate(date.getDate() - 1)).format('YYYYMMDD')

// 요청 주소(어제자 일일 변경분)
const url = encodeURI(
  `https://www.juso.go.kr/dn.do?reqType=DC&stdde=${yesterday}&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
)

// 파일이름, 디렉토리명, WriteStream 생성
const downloadDir = dailyDir
const fileName = `${yesterday}_update.zip`
const zipPath = `${downloadDir}/${fileName}`
const downloadStream = createWriteStream(zipPath)
const downloadOption: TDownloadFileOption = {
  url,
  writeStream: downloadStream,
}

// 클린 다운로드를 위해 기존 리소스 삭제
if (existsSync(downloadDir)) {
  try {
    rmSync(downloadDir, { recursive: true, force: true })
    logger.info(`[DailyUpdatePreparation] Resource directory deletion completed.`)
  } catch (err) {
    logger.error(`[DailyUpdatePreparation] ${err}`)
    process.exit(1)
  }
}

// 디렉토리 생성
try {
  mkdirSync(downloadDir, { recursive: true })
  logger.info(`[DailyUpdatePreparation] Make directory successfully.`)
} catch (err) {
  logger.error(`[DailyUpdatePreparation] ${err}`)
  process.exit(1)
}

const main = async () => {
  ;(await downloadFileAndGetEntries(downloadOption)).forEach(entry => {
    entry.getDataAsync((data, err) => {
      if (err) throw err

      const encodedContent = iconv.decode(data, 'euc-kr')

      writeFile(`${downloadDir}/${entry.entryName}`, encodedContent, err => {
        if (err) throw err
      })
    })
  })
}

main()
  .then(() => logger.info(`[DailyDownloadComplete] Job finished.`))
  .catch(err => {
    logger.error(`[DailyDownloadError] ${err}`)
  })
