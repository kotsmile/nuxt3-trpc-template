import { initTRPC } from '@trpc/server'
import type { Context } from './context'

const t = initTRPC.context<Context>().create()

// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware
