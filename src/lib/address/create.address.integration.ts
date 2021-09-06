import { spawn } from 'child_process'
import { TSidoEng } from '../../types/sido.collections'
import { logger } from '../logger'
import { scriptDir } from '../path'

export function createIntegratedTable(sido: TSidoEng) {
  logger.info(`[CreateIntegratedTable] Start creating integrated table with ${sido}.`)

  spawn('sh', [`${scriptDir}/create_integrated_table.sh`, sido])
    .on('error', (message: string) => {
      logger.info(`[CreateIntegratedTableError] Error on task ${sido}: ${message}`)
      process.exit(1)
    })
    .on('message', (message: string) => {
      logger.info(`[CreateIntegratedTable] Task ${sido}: ${message}`)
    })
    .on('close', () => {
      logger.info(`[CreateIntegratedTable] Completed creating integrated table with ${sido}.`)
    })
}

async function main() {
  const sido: TSidoEng[] = [
    'seoul',
    'incheon',
    'gyeonggi',
    'gangwon',
    'chungnam',
    'chungbuk',
    'daejeon',
    'sejong',
    'jeonnam',
    'jeonbuk',
    'gyeongnam',
    'gyeongbuk',
    'gwangju',
    'daegu',
    'busan',
    'ulsan',
    'jeju',
  ]

  for (const sd of sido) {
    createIntegratedTable(sd)
  }
}

main().catch(e => console.log(e))
