import { exec, spawn } from 'child_process'
import { readdirSync } from 'fs'
import 'dotenv/config'
import path from 'path/posix'
import { logger } from './logger'

const { MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } = process.env

export const importToDb = (tableName: string) => {
  logger.info(`[ImportStarts] Import starts with table name: ${tableName}`)

  let stdoutResult = ''
  let hasErr = false

  const execution = exec(
    `sh ./scripts/import_total_data.sh ${tableName}`,
    (err, stdout, stderr) => {
      if (err || stderr) {
        logger.error(err || stderr)
      }

      logger.info(stdout)
    }
  )
}

try {
  readdirSync(path.resolve(__dirname) + '/../../resources/total').map(fileName => {
    if (fileName.split('.')[1] === 'txt') {
      importToDb(fileName.split('.')[0])
    }
  })
} catch (err) {
  logger.error(err)
}
