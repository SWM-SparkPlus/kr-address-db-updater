import { WriteStream } from 'fs'
import https from 'https'
import { logger } from './logger'
import Zip from 'adm-zip'
import { writeEncodedFileAndImport } from './utf8Writer'

export type TDownloadFileOption = {
  url: string
  writeStream: WriteStream
  downloadDir: string
}

/**
 * 도로명주소 홈페이지 개발자 센터로부터 데이터를 다운받아 압축을 해제하는 프로세스를 진행하는 함수
 *
 * @param url 파일을 다운로드받을 HTTPS URL
 * @param writeStream 쓰기 스트림
 * @param zipPath 다운받을 압축파일 파일 경로
 */
export function downloadFile({ url, writeStream, downloadDir }: TDownloadFileOption): void {
  https.get(url, res => {
    if (!res.statusCode) {
      logger.error(`[FileDownloadError] ${res.statusMessage}`)
    }

    // 다운로드 데이터를 쓰기스트림에 파이프라이닝
    res.pipe(writeStream)

    writeStream.on('finish', () => {
      logger.info(`[FileDownloadComplete]`)

      try {
        new Zip(writeStream.path).getEntries().forEach(entry => {
          entry.getDataAsync((data, err) => {
            if (err) throw err

            writeEncodedFileAndImport(data, entry, downloadDir)
          })
        })
      } catch (err) {
        throw err
      }
    })
  })
}
