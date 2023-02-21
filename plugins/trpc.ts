import { httpBatchLink, createTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from '@/server/trpc/routers'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      trpc: createTRPCProxyClient<AppRouter>({
        links: [
          httpBatchLink({
            url: '/api/trpc',
          }),
        ],
      }),
    },
  }
})
