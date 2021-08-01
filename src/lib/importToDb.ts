import { spawn } from 'child_process'
import EventEmitter from 'events'
import { logger } from './logger'

const { MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } = process.env

export const importerEventListener = new EventEmitter().setMaxListeners(100)

importerEventListener.on('start', (tableName: string) => {
  importToDb(tableName)
})

export const importToDb = (tableName: string) => {
  let stdoutResult = ''
  let hasError = false

  const importSql = `
  SET GLOBAL local_infile = true;
  
  LOAD DATA LOCAL INFILE '/tmp/resources/total/${tableName}.txt'
                INTO TABLE ${tableName}
                FIELDS TERMINATED BY '|'
                LINES TERMINATED BY '\n';
                `
  const spawnListener = spawn(
    `docker exec -it $(docker ps | grep mysql | awk '{ print $1 }') mysql --local-infile=1 -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} -e ${importSql}`
  ).setMaxListeners(100)

  spawnListener.stdout.on('data', data => {
    stdoutResult += data
  })

  spawnListener.on('error', () => {
    hasError = true
  })

  spawnListener.stderr.on('data', data => {
    stdoutResult += data
  })

  spawnListener.on('close', () => {
    hasError
      ? logger.info(`[ImportStdout] ${stdoutResult}`)
      : logger.error(`[ImportStderr] ${stdoutResult}`)
  })
}
