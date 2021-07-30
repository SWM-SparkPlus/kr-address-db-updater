import dayjs from 'dayjs'
import https from 'https'
import fs from 'fs'
import path from 'path'
import iconv from 'iconv-lite'
import Zip from 'adm-zip'
import { logger } from './lib/logger'

console.warn(
  `[TotalDatabaseDownloadWarning] !!! This job contains cpu intensive workload such as string encode/decode and high network usage !!!`
)

// 전월 구하기
const date = new Date()
// const previousMonth = dayjs(date.setMonth(date.getMonth() - 1)).format('YYYYMM')
const previousMonth = '202106'

// 요청주소. 최신 주소 DB
const url = encodeURI(
  `https://www.juso.go.kr/dn.do?reqType=ALLMTCHG&regYmd=${previousMonth.slice(
    0,
    4
  )}&ctprvnCd=00&gubun=MTCH&stdde=${previousMonth}&fileName=${previousMonth}_주소DB_전체분.zip&realFileName=${previousMonth}ALLMTCHG00.zip&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
)

const rootDir = path.resolve(__dirname + '/..')
const targetPath = `${rootDir}/resources/total`
const roadnameAddressFilePath = `${targetPath}/roadname_address_total.txt`
const jibunAddressFilePath = `${targetPath}/jibun_address_total.txt`
const additionalInfoFilePath = `${targetPath}/additional_info_total.txt`

// 클린 다운로드를 위해 기존 리소스 삭제
if (fs.existsSync(targetPath)) {
  try {
    fs.rmSync(targetPath, { recursive: true, force: true })
    logger.info(`[TotalDatabaseDownloadPreparation] Resource directory deletion completed.`)
  } catch (err) {
    logger.error(`[TotalDatabaseDownloadPreparation] ${err}`)
    process.exit(1)
  }
}

// 디렉토리 생성 및 전체분 파일 생성
try {
  fs.mkdirSync(targetPath, { recursive: true })
  fs.close(fs.openSync(roadnameAddressFilePath, 'w'), () => {})
  fs.close(fs.openSync(jibunAddressFilePath, 'w'), () => {})
  fs.close(fs.openSync(additionalInfoFilePath, 'w'), () => {})
  logger.info(`[TotalDatabaseDownloadPreparation] Make directory and empty files successfully.`)
} catch (err) {
  logger.error(`[TotalDatabaseDownloadPreparation] ${err}`)
  process.exit(1)
}

// 파일이름, 디렉토리명, WriteStream 생성
const zipFileName = `${previousMonth}_total.zip`
const zipPath = `${targetPath}/${zipFileName}`
const downloadStream = fs.createWriteStream(zipPath)

// 다운로드 액션
https.get(url, res => {
  if (res.statusCode)
    // 다운로드 데이터를 쓰기스트림에 파이프라이닝
    res.pipe(downloadStream)

  // 스트림 입력 종료시에 압축 해제
  downloadStream.on('finish', async () => {
    logger.info(`[FileDownloadCompletion] Total file download completion`)

    try {
      new Zip(zipPath).getEntries().forEach(entry => {
        entry.getDataAsync((data, err) => {
          if (err) throw err
          // 파일명 인코딩
          const encodedFilename = iconv.decode(entry.rawEntryName, 'euc-kr')

          // 텍스트 파일만 UTF8 인코딩. 그 외의 파일은 처리하지 않음.
          if (encodedFilename.includes('txt') || encodedFilename.includes('TXT')) {
            let targetFilename = ''

            if (encodedFilename.includes('주소_')) {
              targetFilename = roadnameAddressFilePath
            } else if (encodedFilename.includes('지번_')) {
              targetFilename = jibunAddressFilePath
            } else if (encodedFilename.includes('부가정보_')) {
              targetFilename = additionalInfoFilePath
            } else {
              return
            }

            fs.appendFile(targetFilename, iconv.decode(data, 'euc-kr'), err => {
              if (err) throw err
            })
          }
        })
      })
    } catch (err) {
      // zip 파일이 아니거나, 온전하지 못하거나, 날짜에 맞는 파일을 다운받지 못했을 경우 에러 발생
      logger.error(`[ZipExtractError] ${zipFileName}: ${err}`)
      fs.rmSync(targetPath, { force: true, recursive: true })
      process.exit(1)
    }

    logger.info(`[TotalDatabaseDownloadCompletion] Job finished!`)
  })
})
