import EventEmitter from 'events'
import { createWriteStream, readdirSync } from 'fs'
import iconv from 'iconv-lite'
import { Readable } from 'stream'
import { EDatabaseImport } from '../types/import.type'
import { TWriteAndImportOption } from '../types/option.type'
import { SidoObject, TSido } from '../types/sido.collections'
import { importToDb } from './importToDb'
import { logger } from './logger'

export const encoderAndWriteEvent = new EventEmitter().setMaxListeners(100)
encoderAndWriteEvent.on('finish', (tableName: string, target: EDatabaseImport) => {
  importToDb(tableName, target)
})

/**
 * EUC-KR encoded Buffer를 받아 UTF8로 인코딩하고 파일로 쓰기를 실행하는 함수
 *
 * @param data 인코딩할 데이터
 * @param entryOfZip Zip 파일의 엔트리
 * @param writeDir 인코딩된 데이터를 쓸 디렉토리 경로
 */
export const writeEncodedFileAndImport = ({
  data,
  entryOfZip,
  writeDir,
  doImport,
}: TWriteAndImportOption) => {
  // 파일명 우선 인코딩
  const rawFileName = entryOfZip.name
  const encodedFilename = iconv.decode(entryOfZip.rawEntryName, 'euc-kr')
  const txtRegex = /^[tT][xX][tT]$/
  // 확장자 추출
  const dotSplitFilename = encodedFilename.split('.')
  const ext = dotSplitFilename[dotSplitFilename.length - 1]

  // 확장자와 이름을 확인하여 데이터베이스에 필요한 파일만 사용
  if (
    txtRegex.test(ext) &&
    !encodedFilename.includes('자료건수') &&
    !rawFileName.includes('AlterD.JUSUMT')
  ) {
    const sidoName = dotSplitFilename[0].split('_')[1] as TSido
    const tablePostfix = SidoObject[sidoName]
    // UTF8로 인코딩한 read stream
    const readableContentStream = Readable.from(iconv.decode(data, 'euc-kr'))
    let tableName: string = ''
    let tablePrefix: string = ''

    if (encodedFilename.includes('도로명코드')) {
      // 도로명코드
      tableName = 'roadname_code'
    } else {
      // 부가정보, 도로명주소, 지번주소
      if (encodedFilename.includes('주소_')) {
        tablePrefix = 'roadname_address'
      } else if (encodedFilename.includes('지번_')) {
        tablePrefix = 'jibun_address'
      } else if (encodedFilename.includes('부가정보')) {
        tablePrefix = 'additional_info'
      }

      tableName = tablePrefix + '_' + tablePostfix
    }

    // 쓰기 시작
    const fileWriteStream = createWriteStream(`${writeDir}/${tableName}.txt`)
    readableContentStream.pipe(fileWriteStream)

    logger.info(`[FileWrite] Write ${fileWriteStream.path}`)

    // 쓰기가 끝나면 import 실행
    doImport
      ? readableContentStream.on('close', () => {
          encoderAndWriteEvent.emit('finish', tableName, EDatabaseImport.Address)
        })
      : null
  } else if (txtRegex.test(ext) && rawFileName.includes('AlterD.JUSUMT')) {
    // 일변동 데이터가 없을 경우 진행하지 않음
    if (data.toString() === 'No data') {
      return
    }

    const readableContentStream = Readable.from(iconv.decode(data, 'euc-kr'))
    const fileWriteStream = createWriteStream(`${writeDir}/${rawFileName}`)
    readableContentStream.pipe(fileWriteStream)

    logger.info(`[FileWrite] Write ${fileWriteStream.path}`)
  }
}
