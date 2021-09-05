import { Connection } from 'typeorm'
import { addMetadata } from '../../typeorm/addMetadata'
import { getDbConnection } from '../../typeorm/connection'
import { getIntegratedAddressTableEntity } from '../../typeorm/entities/integrated.address.entity'
import { getJibunEntityByTableName } from '../../typeorm/entities/jibun.entity'
import { getJusoEntityByTableName } from '../../typeorm/entities/juso.entity'
import { RoadcodeEntity } from '../../typeorm/entities/roadcode.entity'
import { TSido } from '../../types/sido.collections'
import { logger } from '../logger'

async function createIntegratedAddressTable(sido: TSido) {
  try {
    const connection = await getDbConnection()

    const targetJusoEntity = getJusoEntityByTableName('roadname_address_seoul')
    const targetJibunEntity = getJibunEntityByTableName('jibun_address_seoul')
    const roadcodeEntity = RoadcodeEntity
    addMetadata(connection, targetJusoEntity)
    addMetadata(connection, targetJibunEntity)
    addMetadata(connection, roadcodeEntity)

    const seoulData = await connection.manager.find(targetJusoEntity)

    for (const data of seoulData) {
      // 도로명주소 데이터에서 (관리번호, 도로명코드, 지하여부, 건물본번, 건불부번, 기초구역코드) 적출 -> 같은 관리번호로 지번주소 테이블에서 (법정동코드, 법정리명) 적출 -> 도로명코드로 (시도명, 시군구명, 읍면동명, 도로명) 적출
      let integrationAddressData: any = {
        manage_number: data.manage_number,
        roadname_code: data.roadname_code,
        is_basement: data.is_basement,
        building_primary_number: data.building_primary_number,
        building_secondary_number: data.building_secondary_number,
        zipcode: data.basic_state_number,
      }

      const targetJibunData = await connection.manager.findOne(targetJibunEntity, {
        manage_number: data.manage_number,
      })
      const targetRoadcodeData = await connection.manager.findOne(roadcodeEntity, {
        roadname_code: data.roadname_code,
      })

      if (!targetJibunData || !targetRoadcodeData) return

      integrationAddressData = {
        ...integrationAddressData,
        bupjungdong_code: targetJibunData!.bupjungdong_code,
        bupjungli: targetJibunData?.bupjungli,
        sido: targetRoadcodeData!.sido,
        sigungu: targetRoadcodeData!.sigungu,
        eupmyeondong: targetRoadcodeData?.eupmyeondong,
        roadname: targetRoadcodeData!.roadname,
      }

      const integratedAddressEntity = getIntegratedAddressTableEntity('integrated_address_seoul')
      addMetadata(connection, integratedAddressEntity)

      await connection.manager.save(integratedAddressEntity, integrationAddressData, {
        reload: false,
      })
    }
  } catch (err) {
    throw err
  }
}

createIntegratedAddressTable('서울특별시').catch(err => {
  logger.error(err)
  process.exit(1)
})
