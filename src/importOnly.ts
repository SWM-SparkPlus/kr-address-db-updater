import { readdirSync } from 'fs'
import path from 'path'
import { importToDb } from './lib/importToDb'
import { logger } from './lib/logger'

const files = readdirSync(path.resolve(__dirname) + '/../resources/total')

try {
  files.map(fileName => {
    if (fileName.split('.')[1] === 'txt') {
      importToDb(fileName.split('.')[0])
    }
  })
} catch (err) {
  logger.error(`[FileImportError] ${err}`)
}
