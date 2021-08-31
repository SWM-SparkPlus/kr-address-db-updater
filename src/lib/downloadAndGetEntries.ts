import https from 'https'
import { logger } from './logger'
import Zip, { IZipEntry } from 'adm-zip'
import { TDownloadFileOption } from '../types/option.type'

/**
 * 도로명주소 홈페이지 개발자 센터로부터 데이터를 다운받아 압축파일 엔트리를 반환하는 함수
 *
 * @param url 파일을 다운로드받을 HTTPS URL
 * @param writeStream 다운받을 파일의 쓰기 스트림
 */
export function downloadFileAndGetEntries({
  url,
  writeStream,
}: TDownloadFileOption): Promise<IZipEntry[]> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (!res.statusCode) {
        reject(res.statusMessage)
      }

      // 다운로드 데이터를 쓰기스트림에 파이프라이닝
      res.pipe(writeStream)

      writeStream.on('finish', () => {
        logger.info(`[FileDownloadComplete]`)

        resolve(new Zip(writeStream.path).getEntries())
      })
    })
  })
}