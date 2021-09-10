import AdmZip from 'adm-zip'
import { WriteStream } from 'fs'

export type TWriteAndImportOption = {
  data: Buffer
  entryOfZip: AdmZip.IZipEntry
  writeDir: string
  doImport: boolean
  doDailyUpdate: boolean
}

export type TDownloadFileOption = {
  url: string
  writeStream: WriteStream
}

export type TDownloadActionOption = {
  targetDate: string
  doImport?: boolean
  doDailyUpdate?: boolean
}
