import { existsSync, mkdirSync } from 'fs'
import { dailyDir, totalDir } from './projectPath'

export const downloadPathHandler = () => {
  if (!existsSync(totalDir)) {
    mkdirSync(totalDir, { recursive: true })
  }

  if (!existsSync(dailyDir)) {
    mkdirSync(dailyDir, { recursive: true })
  }
}
