import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})

export async function safe<T, E>(promise: Promise<T>): Promise<[null, E] | [T, null]> {
  try {
    return [await promise, null]
  } catch (error) {
    console.error(error)
    return [null, error as E]
  }
}
