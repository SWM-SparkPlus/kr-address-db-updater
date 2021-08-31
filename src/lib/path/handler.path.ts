import { existsSync, mkdirSync } from 'fs'
import { dailyDir, monthlyDir, totalDir } from '.'

/**
 * 데이터베이스 전체분 및 일일 변동분을 다운받는 경로를 처리하는 함수
 */
export const downloadPathHandler = () => {
  if (!existsSync(totalDir)) {
    mkdirSync(totalDir, { recursive: true })
  }

  if (!existsSync(monthlyDir)) {
    mkdirSync(monthlyDir, { recursive: true })
  }

  if (!existsSync(dailyDir)) {
    mkdirSync(dailyDir, { recursive: true })
  }
}
