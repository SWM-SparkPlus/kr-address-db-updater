import { createWriteStream, rmSync } from 'fs'
import dayjs from 'dayjs'
import { downloadFileAndGetEntries } from '../downloadAndGetEntries'
import { logger } from '../logger'
import { dailyDir, totalDir } from '../path'
import { writeAddressFile } from './write.address'
import { downloadPathHandler } from '../path/handler.path'
import { TDownloadFileOption } from '../../types/option.type'

export async function downloadAndWriteAddressFiles(
  targetDate: string,
  doImport?: boolean,
  doDailyUpdate?: boolean
) {
  try {
    downloadPathHandler()

    if (!dayjs(targetDate).isValid()) {
      logger.error(`[DownloadAddressError] Input date "${targetDate}" is invalid`)
      return process.exit(1)
    }

    const downloadFlag = targetDate.length === 8 ? 'Daily' : 'Total'
    let url = ''
    let downloadDir = ''

    if (downloadFlag === 'Daily') {
      url = encodeURI(
        `https://www.juso.go.kr/dn.do?reqType=DCM&stdde=${targetDate}&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
      )
      downloadDir = dailyDir
    } else if (downloadFlag === 'Total') {
      url = encodeURI(
        `https://www.juso.go.kr/dn.do?reqType=ALLMTCHG&regYmd=${targetDate.slice(
          0,
          4
        )}&ctprvnCd=00&gubun=MTCH&stdde=${targetDate}&fileName=${targetDate}_주소DB_전체분.zip&realFileName=${targetDate}ALLMTCHG00.zip&indutyCd=999&purpsCd=999&indutyRm=수집종료&purpsRm=수집종료`
      )
      downloadDir = totalDir
    }

    logger.info(`[${downloadFlag}AddressFileDownloadStarts] Downloads start with ${targetDate}`)

    const writeStream = createWriteStream(`${downloadDir}/address_file_DB.zip`)
    ;(await downloadFileAndGetEntries({ url, writeStream } as TDownloadFileOption)).forEach(
      entry => {
        entry.getDataAsync((data, err) => {
          if (err) throw err

          writeAddressFile({
            data,
            entryOfZip: entry,
            writeDir: downloadDir,
            doImport: doImport ?? false,
            doDailyUpdate: doDailyUpdate ?? false,
          })
        })
      }
    )

    rmSync(writeStream.path)
  } catch (err) {
    logger.error(err)
  }
}
