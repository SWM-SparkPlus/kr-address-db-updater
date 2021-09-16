import dayjs from 'dayjs'
import { logger } from './lib/logger'
import { downloadPositionSummary } from './lib/positionSummary/download.position.summary'
import { downloadZipcodeFilesAndWrite } from './lib/zipcode/download.zipcode'
import { doImportFilesToDb } from './lib/address/doImportFile.address'
import { downloadAndWriteAddressFiles } from './lib/address/download/download.address'
import { downloadAccumulationDailyAddress } from './lib/address/download/download.acc.address'
import { updateDailyAddress } from './lib/address/update/update.daily.address'
import { downloadPathHandler } from './lib/path/handler.path'
import { updateAccumulationAddress } from './lib/address/update/update.acc.address'

async function main() {
  // process.argv 순서
  // (0) ts-node
  // (1) src/main.ts
  // (2) [download][update][import]
  // (3) [address][zipcode][position_summary]
  // (4) [total][daily][monthly][accumulation]
  const [task, target, range] = process.argv.slice(2)
  downloadPathHandler()

  if (task === 'download') {
    if (target === 'address') {
      if (range === 'total') {
        downloadAndWriteAddressFiles({
          targetDate: dayjs(new Date()).subtract(1, 'month').format('YYYYMM'),
        })
      } else if (range === 'daily') {
        downloadAndWriteAddressFiles({
          targetDate: dayjs(new Date()).subtract(1, 'day').format('YYYYMMDD'),
        })
      } else if (range === 'accumulation') {
        downloadAccumulationDailyAddress()
      } else {
        logger.warn(
          `[UnknownArgumentError] Executing main.ts with arguments ${task} ${target} ${range}`
        )
        process.exit(0)
      }
    } else if (target === 'zipcode') {
      downloadZipcodeFilesAndWrite()
    } else if (target === 'position_summary') {
      downloadPositionSummary(range)
    } else {
      logger.warn(
        `[UnknownArgumentError] Executing main.ts with arguments ${task} ${target} ${range}`
      )
      process.exit(0)
    }
  } else if (task === 'import') {
    if (target === 'address') {
      doImportFilesToDb()
    } else {
      logger.warn(
        `[UnknownArgumentError] Executing main.ts with arguments ${task} ${target} ${range}`
      )
      process.exit(0)
    }
  } else if (task === 'update') {
    if (target === 'address') {
      if (range === 'daily') {
        const targetDate = dayjs(new Date()).format('YYYYMMDD')
        updateDailyAddress(targetDate)
      } else if (range === 'accumulation') {
        updateAccumulationAddress()
      } else {
        logger.warn(
          `[UnknownArgumentError] Executing main.ts with arguments ${task} ${target} ${range}`
        )
        process.exit(0)
      }
    } else {
      logger.warn(
        `[UnknownArgumentError] Executing main.ts with arguments ${task} ${target} ${range}`
      )
      process.exit(0)
    }
  } else {
    logger.warn(
      `[UnknownArgumentError] Executing main.ts with arguments ${task} ${target} ${range}`
    )
    process.exit(0)
  }
}

main()
