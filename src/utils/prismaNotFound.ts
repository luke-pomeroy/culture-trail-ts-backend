import { Prisma } from "@prisma/client"

export default async function recoverFromNotFound<A>(
    promise: Promise<A>,
  ): Promise<A | null> {
    try {
      return await promise
    } catch (e) {
      console.log(e)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        //Record not found
        if (e.code === 'P2025') {
          return null
        }

        //Parent not found
        if (e.code === 'P2016') {
            return null
        }
      }
      
      throw e
    }
  }