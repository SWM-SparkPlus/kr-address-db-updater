import { createWriteStream } from 'fs'
import { downloadFileAndGetEntries, TDownloadFileOption } from './fileDownloader'
import { logger } from './logger'
import { downloadPathHandler } from './pathHandler'
import { totalDir } from './projectPath'
import { writeEncodedFileAndImport } from './addressFileWriter'

downloadPathHandler()

const url = 'https://www.epost.go.kr/search/areacd/zipcode_DB.zip'

// 우편번호|시도|시도영문|시군구|시군구영문|읍면|읍면영문|도로명코드|도로명|도로명영문|지하여부|건물번호본번|건물번호부번|건물관리번호|다량배달처명|시군구용건물명|법정동코드|법정동명|리명|행정동명|산여부|지번본번|읍면동일련번호|지번부번|구우편번호|우편번호일련번호

async function downloadZipcodeFilesAndWrite() {
  const filePath = `${totalDir}/zipcode_DB.zip`
  const writeStream = createWriteStream(filePath)

  await (
    await downloadFileAndGetEntries({ url, writeStream } as TDownloadFileOption)
  ).forEach(entry => {
    entry.getDataAsync((data, err) => {
      if (err) throw err

      writeEncodedFileAndImport({
        data,
        entryOfZip: entry,
        writeDir: `${totalDir}/${entry.name}`,
        doImport: false,
      })
    })
  })
}

downloadZipcodeFilesAndWrite().catch(err => {
  logger.error(err)
})
