import { EventEmitter } from 'events'
import { createWriteStream, rmSync } from 'fs'
import dayjs from 'dayjs'
import { downloadFileAndGetEntries } from '../downloadAndGetEntries'
import { logger } from '../logger'
import { dailyDir, totalDir } from '../path'
import { writeAddressFileAndImport } from './write.address'
import { downloadPathHandler } from '../path/handler.path'
import { TDownloadFileOption } from '../../types/option.type'

const downloadOnlyEvent = new EventEmitter()
downloadOnlyEvent.on('assigned', () => {})
downloadOnlyEvent.on('finish', (target: string) => {
  logger.info(`[DonwloadOnlyScriptCompletion] Download ${target} completed.`)
})

async function downloadAddressFilesOnly(downloadFlag: string) {
  downloadPathHandler()

  const argCandidate = ['--daily', '-d', '--total', '-t']

  if (argCandidate.includes(downloadFlag)) {
    const date = new Date()
    let url = ''
    let downloadDir = ''

    // 매개변수에 따라 다르게 처리
    if (downloadFlag === '--daily' || downloadFlag === '-d') {
      const yesterday = dayjs(date.setDate(date.getDate() - 1)).format('YYYYMMDD')
      url = encodeURI(
        `https://www.juso.go.kr/dn.do?reqType=DCM&stdde=${yesterday}&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
      )
      downloadDir = dailyDir

      logger.info(`[Preparation] Start on ${date}, download based on ${yesterday}`)
    } else if (downloadFlag === '--total' || downloadFlag === '-t') {
      const previousMonth = dayjs(date.setMonth(date.getMonth() - 2)).format('YYYYMM')
      url = encodeURI(
        `https://www.juso.go.kr/dn.do?reqType=ALLMTCHG&regYmd=${previousMonth.slice(
          0,
          4
        )}&ctprvnCd=00&gubun=MTCH&stdde=${previousMonth}&fileName=${previousMonth}_주소DB_전체분.zip&realFileName=${previousMonth}ALLMTCHG00.zip&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
      )
      downloadDir = totalDir
      logger.info(`[Preparation] Start on ${date}, download based on ${previousMonth}`)
    }

    logger.info(`[DownloadScriptStart]`)

    const writeStream = createWriteStream(`${downloadDir}/address_file_DB.zip`)
    ;(await downloadFileAndGetEntries({ url, writeStream } as TDownloadFileOption)).forEach(
      entry => {
        entry.getDataAsync((data, err) => {
          if (err) throw err

          writeAddressFileAndImport({
            data,
            entryOfZip: entry,
            writeDir: downloadDir,
            doImport: false,
          })
        })
      }
    )

    rmSync(writeStream.path)
  } else {
    logger.error(`[UnexpectedArgvError] argv ${arg} is unsupported.`)
    process.exit(0)
  }
}

const arg = process.argv[2]
downloadAddressFilesOnly(arg).catch(err => {
  logger.error(`[UnexpectedError] ${err}`)
  process.exit(1)
})
