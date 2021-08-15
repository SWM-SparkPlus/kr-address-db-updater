import { PrismaClient } from '@prisma/client'
import {
  TAddInfoTableName,
  TAddInfoTableSchema,
  TIntegratedTableName,
  TJibunTableName,
  TJibunTableSchema,
  TRoadnameTableName,
  TRoadnameTableSchema,
} from '../lib/sido'

export const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error', 'query'],
  errorFormat: 'pretty',
})

export const createOnJusoTable = async (
  tablename: string,
  data: TRoadnameTableSchema
): Promise<void> => {
  await prismaClient[tablename as TRoadnameTableName].create({ data })
}

export const createOnJibunTable = async (
  tablename: string,
  data: TJibunTableSchema
): Promise<void> => {
  await prismaClient[tablename as TJibunTableName].create({ data })
}

export const createOnAddinfoTable = async (
  tablename: string,
  data: TAddInfoTableSchema
): Promise<void> => {
  await prismaClient[tablename as TAddInfoTableName].create({ data })
}

export const updateOnJusoTableByManageNumber = async (
  tablename: string,
  manage_number: string,
  data: TRoadnameTableSchema
): Promise<void> => {
  await prismaClient[tablename as TRoadnameTableName].update({
    where: {
      manage_number: manage_number,
    },
    data,
  })
}

export const updateOnJibunTableByManageNumber = async (
  tablename: string,
  manage_number: string,
  data: TJibunTableSchema
): Promise<void> => {
  await prismaClient[tablename as TJibunTableName].update({
    where: {
      manage_number: manage_number,
    },
    data,
  })
}

export const updateOnAddinfoTableByManageNumber = async (
  tablename: string,
  manage_number: string,
  data: TAddInfoTableSchema
): Promise<void> => {
  await prismaClient[tablename as TAddInfoTableName].update({
    where: {
      manage_number: manage_number,
    },
    data,
  })
}

export const deleteOnJusoByManageNumber = async (
  tablename: string,
  manage_number: string
): Promise<void> => {
  await prismaClient[tablename as TRoadnameTableName].delete({
    where: {
      manage_number,
    },
  })
}

export const deleteOnJibunByManageNumber = async (
  tablename: string,
  manage_number: string
): Promise<void> => {
  await prismaClient[tablename as TJibunTableName].delete({
    where: {
      manage_number,
    },
  })
}

export const deleteOnAddinfoByManageNumber = async (
  tablename: string,
  manage_number: string
): Promise<void> => {
  await prismaClient[tablename as TAddInfoTableName].delete({
    where: {
      manage_number,
    },
  })
}
