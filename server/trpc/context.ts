/* eslint-disable @typescript-eslint/no-unused-vars */
import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { verifyJWT } from '@/server/utils'

export type Context = inferAsyncReturnType<typeof createContext>

export async function createContext(event: H3Event) {
  const headers = getHeaders(event)
  async function getUserFromHeader() {
    if (headers.authorization) {
      const user = await verifyJWT(headers.authorization.split(' ')[1])
      return user
    }
    return null
  }
  const user = await getUserFromHeader()

  return {
    user,
  }
}
