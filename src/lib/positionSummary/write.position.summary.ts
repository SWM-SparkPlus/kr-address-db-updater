import EventEmitter from 'events'
import { createWriteStream } from 'fs'
import iconv from 'iconv-lite'
import { Readable } from 'stream'
import { EDatabaseImport } from '../../types/import.type'
import { TWriteAndImportOption } from '../../types/option.type'
import { importToDb } from '../address/importToDb.address'
import { logger } from '../logger'

export const encoderAndWriteEvent = new EventEmitter().setMaxListeners(100)
encoderAndWriteEvent.on('finish', (tableName: string, target: EDatabaseImport) => {
  importToDb(tableName, target)
})

/**
 * 위치정보요약 EUC-KR encoded buffer를 받아 UTF8로 인코딩하고 파일로 쓰기를 실행하는 함수
 *
 * @param data 인코딩할 데이터
 * @param entryOfZip Zip 파일의 엔트리
 * @param writeDir 인코딩된 데이터를 쓸 디렉토리 경로
 */
export const writePositionSummaryAndImport = ({
  data,
  entryOfZip,
  writeDir,
  doImport,
}: TWriteAndImportOption) => {
  // 파일명 우선 인코딩
  const entryName = entryOfZip.entryName
  const txtRegex = /^[tT][xX][tT]$/
  // 확장자 추출
  const dotSplitFilename = entryName.split('.')
  const filenameExceptExt = dotSplitFilename[0]
  const ext = dotSplitFilename[dotSplitFilename.length - 1]

  // 확장자와 이름을 확인하여 데이터베이스에 필요한 파일만 사용
  if (txtRegex.test(ext)) {
    // UTF8로 인코딩한 read stream
    const readableContentStream = Readable.from(iconv.decode(data, 'euc-kr'))

    // 쓰기 시작
    const fileWriteStream = createWriteStream(`${writeDir}/${filenameExceptExt}.txt`)
    readableContentStream.pipe(fileWriteStream)

    logger.info(`[FileWrite] Write ${fileWriteStream.path}`)

    // 쓰기가 끝나면 import 실행
    doImport
      ? readableContentStream.on('close', () => {
          encoderAndWriteEvent.emit('finish', filenameExceptExt, EDatabaseImport.Address)
        })
      : null
  } else if (txtRegex.test(ext) && entryName.includes('AlterD.JUSUMT')) {
    // 일변동 데이터가 없을 경우 진행하지 않음
    if (data.toString() === 'No data') return

    const readableContentStream = Readable.from(iconv.decode(data, 'euc-kr'))
    const fileWriteStream = createWriteStream(`${writeDir}/${entryName}`)
    readableContentStream.pipe(fileWriteStream)

    logger.info(`[FileWrite] Write ${fileWriteStream.path}`)
  }
}
