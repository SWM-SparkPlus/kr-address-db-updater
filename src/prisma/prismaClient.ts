import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error', 'query'],
  errorFormat: 'pretty',
})
