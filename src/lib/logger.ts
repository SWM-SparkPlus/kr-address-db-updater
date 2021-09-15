import dayjs from 'dayjs'
import fs from 'fs'
import { createLogger, format, transports } from 'winston'
import WinstonDaily from 'winston-daily-rotate-file'

const { combine, printf } = format

// logs dir
const logDir = `${__dirname}/../../logs`

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logFormat = printf(
  ({ level, message }) => `${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')} ${level}: ${message}`
)

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = createLogger({
  format: combine(logFormat),
  transports: [
    // info log setting
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`,
      filename: `%DATE%.log`,
      maxFiles: 7, // 7 Days saved
      json: true,
      zippedArchive: true,
    }),
    // error log setting
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 7, // 7 Days saved
      handleExceptions: true,
      json: true,
      zippedArchive: true,
    }),
  ],
})

logger.add(
  new transports.Console({
    format: format.combine(format.splat(), format.colorize(), format.simple()),
  })
)

export { logger }
