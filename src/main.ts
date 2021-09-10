import dayjs from 'dayjs'
import { logger } from './lib/logger'
import { downloadPositionSummary } from './lib/positionSummary/download.position.summary'
import { downloadZipcodeFilesAndWrite } from './lib/zipcode/download.zipcode'
import { doImportFilesToDb } from './lib/address/doImportFile.address'
import { downloadAndWriteAddressFiles } from './lib/address/download.address'
import { updateAccumulatedDailyAddress } from './lib/address/update.acc.address'
import { updateDailyAddress } from './lib/address/updateDaily.address'

async function main() {
  // process.argv 순서
  // (0) ts-node
  // (1) src/main.ts
  // (2) [download][update][import]
  // (3) [address][zipcode][position_summary]
  // (4) [total][daily][monthly][accumulation]
  const [task, target, range] = process.argv.slice(2)

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
        const targetDate = dayjs(new Date()).subtract(1, 'day').format('YYYYMMDD')
        await downloadAndWriteAddressFiles({ targetDate })
        await updateDailyAddress(targetDate)
      } else if (range === 'accumulation') {
        updateAccumulatedDailyAddress()
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
