import path from 'path'
import { readdirSync } from 'fs'
import { importToDb } from './importToDb.address'
import { logger } from '../logger'
import { EDatabaseImport } from '../../types/import.type'

const files = readdirSync(path.resolve(__dirname) + '/../../../resources/total')

try {
  files.map(fileName => {
    if (fileName.split('.')[1] === 'txt') {
      importToDb(fileName.split('.')[0], EDatabaseImport.Address)
    }
  })
} catch (err) {
  logger.error(`[FileImportError] ${err}`)
}
