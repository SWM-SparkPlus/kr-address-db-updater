import { createWriteStream, rmSync } from 'fs'
import dayjs from 'dayjs'
import { downloadFileAndGetEntries } from '../downloadAndGetEntries'
import { logger } from '../logger'
import { totalDir } from '../path'
import { TDownloadFileOption } from '../../types/option.type'
import { zipcodeFileWriterAndImport } from './write.zipcode'

/**
 * 우편번호 데이버테이스를 다운받고 로컬머신에 파일로 기록하는 함수
 *
 * 1. 우편번호 데이터베이스 압축파일 다운
 * 2. 압축 파일의 엔트리를 영문명으로 변경하고 파일 쓰기 실행
 * 3. 파일 쓰기가 끝나면 import flag에 따라 import 수행
 */
export async function downloadZipcodeFilesAndWrite() {
  const date = new Date()
  const previousMonth = dayjs(date.setMonth(date.getMonth() - 1)).format('YYYYMM')
  logger.info(`[PREPARATION] Start on ${date}, download based on ${previousMonth}`)

  const url = 'https://www.epost.go.kr/search/areacd/zipcode_DB.zip'
  const filePath = `${totalDir}/zipcode_DB.zip`
  const writeStream = createWriteStream(filePath)

  await (
    await downloadFileAndGetEntries({ url, writeStream } as TDownloadFileOption)
  ).forEach(entry => {
    entry.getDataAsync((data, err) => {
      if (err) throw err

      zipcodeFileWriterAndImport({
        data,
        entryOfZip: entry,
        writeDir: totalDir,
        doImport: false,
        doDailyUpdate: false,
      })
    })
  })

  rmSync(filePath)
}
