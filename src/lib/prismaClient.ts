import { PrismaClient } from '@prisma/client'

export default new PrismaClient({ log: ['error', 'info', 'query'] })
