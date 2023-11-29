import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
//{log: ['query', 'info', 'warn', 'error']}
// prisma.$on('query' as never, async (e: Prisma.QueryEvent) => {
//     console.log(`${e.query} ${e.params}`)
// })
export default prisma
