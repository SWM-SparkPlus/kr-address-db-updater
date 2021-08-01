import AdmZip from 'adm-zip'
import EventEmitter from 'events'
import { createWriteStream } from 'fs'
import iconv from 'iconv-lite'
import { Readable } from 'stream'
import { SidoObject, TSido } from './sido'
import { importToDb } from './importToDb'

export const encoderAndWriteEvent = new EventEmitter().setMaxListeners(100)
encoderAndWriteEvent.on('finish', (tableName: string) => {
  importToDb(tableName)
})

/**
 * EUC-KR 버퍼 데이터를 받아 UTF8로 인코딩하고 파일로 쓰기를 실행하는 함수
 *
 * @param data 인코딩할 데이터
 * @param entryOfZip Zip 파일의 엔트리
 * @param writeDir 인코딩된 데이터를 쓸 디렉토리 경로
 */
export const writeEncodedFileAndImport = (
  data: Buffer,
  entryOfZip: AdmZip.IZipEntry,
  writeDir: string
) => {
  // 파일명 우선 인코딩
  const encodedFilename = iconv.decode(entryOfZip.rawEntryName, 'euc-kr')

  // 확장자 추출
  const dotSplitFilename = encodedFilename.split('.')
  const ext = dotSplitFilename[dotSplitFilename.length - 1]

  // 확장자와 이름을 확인하여 데이터베이스에 필요한 파일만 사용
  if (ext === 'txt' && !encodedFilename.includes('자료건수')) {
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

    // 쓰기가 끝나면 import 실행
    readableContentStream.on('close', () => {
      encoderAndWriteEvent.emit('finish', tableName)
    })
  }
}
