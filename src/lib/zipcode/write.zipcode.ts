import EventEmitter from 'events'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import iconv from 'iconv-lite'
import { EDatabaseImport } from '../../types/import.type'
import { TWriteAndImportOption } from '../../types/option.type'
import { SidoObject, TSido } from '../../types/sido.collections'
import { logger } from '../logger'
import { afterWriteEvent } from '../address/address.event'

/**
 * 우편번호 EUC-KR encoded buffer를 받아 UTF8로 인코딩하고 파일로 쓰기를 실행하는 함수
 *
 * @param data 인코딩할 데이터
 * @param entryOfZip Zip 파일의 엔트리
 * @param writeDir 인코딩된 데이터를 쓸 디렉토리 경로
 */
export const zipcodeFileWriterAndImport = ({
  data,
  entryOfZip,
  writeDir,
  doImport,
}: TWriteAndImportOption) => {
  const fileName = iconv.decode(entryOfZip.rawEntryName, 'euc-kr')
  const txtRegex = /^[tT][xX][tT]$/
  // 확장자 추출
  const dotSplitFilename = fileName.split('.')
  const ext = dotSplitFilename[dotSplitFilename.length - 1]

  // 확장자와 이름을 확인하여 데이터베이스에 필요한 파일만 사용
  if (txtRegex.test(ext) && !fileName.includes('참고자료')) {
    // MySQL에서 읽을 수 있도록 영어로 변환
    const sidoName = dotSplitFilename[0] as TSido
    const tablePostfix = SidoObject[sidoName]

    const readableContentStream = Readable.from(data)
    const tableName = `zipcode_${tablePostfix}`

    // 쓰기 시작
    const fileWriteStream = createWriteStream(`${writeDir}/${tableName}.txt`)
    readableContentStream.pipe(fileWriteStream)

    logger.info(`[FILE_WRITE] ${fileWriteStream.path}`)

    // 쓰기가 끝나면 import 실행
    doImport
      ? readableContentStream.on('close', () => {
          afterWriteEvent.emit('doImport', tableName, EDatabaseImport.Zipcode)
        })
      : null
  }
}
