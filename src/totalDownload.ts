import dayjs from 'dayjs'
import https from 'https'
import fs from 'fs'
import path from 'path'
import iconv from 'iconv-lite'
import './lib/env'
import Zip from 'adm-zip'
import { logger } from './lib/logger'
import { SidoObject, TSido } from './lib/sido'
import { Readable } from 'stream'
import { spawn } from 'child_process'
import EventEmitter from 'events'

const eventEmitter = new EventEmitter()
eventEmitter.setMaxListeners(100)

console.warn(
  `[TotalDatabaseDownloadWarning] !!! This job contains cpu intensive workload such as string encode/decode and high network usage !!!`
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
const targetPath = `${rootDir}/resources/total`

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

// 디렉토리 생성
try {
  fs.mkdirSync(targetPath, { recursive: true })
  logger.info(`[TotalDatabaseDownloadPreparation] Make directory successfully.`)
} catch (err) {
  logger.error(`[TotalDatabaseDownloadPreparation] ${err}`)
  process.exit(1)
}

// 파일이름, 디렉토리명, WriteStream 생성
const fileName = `${previousMonth}_total.zip`
const zipPath = `${targetPath}/${fileName}`
const writeStream = fs.createWriteStream(zipPath)

// const dirEntries: string[] = []

// 다운로드 액션
https.get(url, res => {
  if (!res.statusCode) {
    logger.error(`[FileDownloadError] ${res.statusMessage}`)
  }

  // 다운로드 데이터를 쓰기스트림에 파이프라이닝
  res.pipe(writeStream)

  // 스트림 입력 종료시에 압축 해제
  writeStream.on('finish', async () => {
    logger.info(`[FileDownloadCompletion] Total file download completion`)

    try {
      new Zip(zipPath).getEntries().forEach(entry => {
        entry.getDataAsync((data, err) => {
          if (err) throw err

          // 인코딩
          const encodedFilename = iconv.decode(entry.rawEntryName, 'euc-kr')

          // // import에서 사용하기 위해 임시 저장
          // dirEntries.push(encodedFilename)

          // 확장자 추출
          const dotSplitFilename = encodedFilename.split('.')
          const ext = dotSplitFilename[dotSplitFilename.length - 1]

          // 데이터베이스에 필요한 파일만 사용
          if (ext === 'txt' && !encodedFilename.includes('자료건수')) {
            let tableName: string
            let tablePrefix: string
            const sidoName = dotSplitFilename[0].split('_')[1] as TSido
            const tablePostfix = SidoObject[sidoName]
            const readableContentStream = Readable.from(iconv.decode(data, 'euc-kr'))

            // 부가정보, 도로명주소, 지번주소
            if (encodedFilename.includes('주소_')) {
              tablePrefix = 'roadname_address'
            } else if (encodedFilename.includes('지번_')) {
              tablePrefix = 'jibun_address'
            } else if (encodedFilename.includes('부가정보')) {
              tablePrefix = 'additional_info'
            }

            encodedFilename.includes('전체분')
              ? (tableName = 'roadname_code')
              : tablePrefix + '_' + tablePostfix

            // read stream event 등록
            readableContentStream.on('end', () => {
              const importSql = `
              SET GLOBAL local_infile = true;
              
              LOAD DATA LOCAL INFILE '/tmp/resources/total/${tableName}.txt'
              INTO TABLE ${tableName}
              FIELDS TERMINATED BY '|'
              LINES TERMINATED BY '\n';
              `

              // 파일로 분리 필요
              const { MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } = process.env
              spawn(
                `docker exec -it $(docker ps | grep mysql | awk '{ print $1 }') mysql --local-infile=1 -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} -e ${importSql}`
              )
            })

            // 쓰기 시작
            const fileWriteStream = fs.createWriteStream(`${targetPath}/${tableName}.txt`)
            readableContentStream.pipe(fileWriteStream)
          }
        })
      })
    } catch (err) {
      // zip 파일이 형식이 아닌거나 일자가 맞지 않을 경우 에러 발생
      logger.error(`[ZipExtractError] ${err}`)
      fs.rmSync(targetPath, { force: true, recursive: true })
      process.exit(1)
    }
  })
})
