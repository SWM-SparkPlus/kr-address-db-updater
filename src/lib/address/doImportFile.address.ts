import path from 'path'
import { readdirSync } from 'fs'
import { importToDb } from './importFile.address'
import { logger } from '../logger'
import { EDatabaseImport } from '../../types/import.type'

const files = readdirSync(path.resolve(__dirname) + '/../../../resources/total')

try {
  files.map(fileName => {
    importToDb(fileName.split('.')[0])
  })
} catch (err) {
  logger.error(`[FileImportError] ${err}`)
  process.exit(1)
}
