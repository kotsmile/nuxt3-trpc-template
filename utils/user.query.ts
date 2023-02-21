import { useQuery } from '@tanstack/vue-query'

export const USER_TAG = 'user'

export const useGetBalance = (userId: number) => {
  const { $trpc } = useNuxtApp()
  return useQuery({
    queryKey: [USER_TAG, userId],
    queryFn: () => $trpc.user.getBalance.query({ userId }),
  })
}

export const useGetNfts = (userId: number) => {
  const { $trpc } = useNuxtApp()
  return useQuery({
    queryKey: [USER_TAG, userId],
    queryFn: () => $trpc.user.getNfts.query({ userId }),
  })
}
