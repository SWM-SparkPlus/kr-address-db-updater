import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error', 'query'],
  errorFormat: 'pretty',
})

export const createOne = async (tablename: string, data): Promise<void> => {
  await prismaClient[tablename].create({ data })
}

export const updateOnyByManageNumber = async (
  tablename: string,
  manage_number: string,
  data
): Promise<void> => {
  await prismaClient[tablename].update({
    where: {
      manage_number: manage_number,
    },
    data,
  })
}

export const deleteOnyByManageNumber = async (
  tablename: string,
  manage_number: string,
  data
): Promise<void> => {
  await prismaClient[tablename].delete({
    where: {
      manage_number,
    },
  })
}
