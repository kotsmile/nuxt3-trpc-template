import { z } from 'zod'

import { router, publicProcedure } from '@/server/trpc'
import { prisma } from '@/server/services/db'
import { authProcedure, Role } from '@/server/utils'
import { TRPCError } from '@trpc/server'

export const user = router({
  getBalance: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input: { userId } }) => {
      console.log({ userId })
      return (
        (await prisma.balance.findUnique({
          where: {
            userId,
          },
        })) ?? 0
      )
    }),
  getNfts: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input: { userId } }) => {
      return (
        (await prisma.nft.findMany({
          where: {
            userId,
          },
        })) ?? []
      )
    }),

  addNfts: authProcedure
    .input(
      z.object({
        userId: z.number(),
        nftIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { role } = ctx.user
      if (role !== Role.ADMIN)
        throw new TRPCError({
          message: `You don't have permission to add NFTs`,
          code: 'UNAUTHORIZED',
        })

      const nfts = await prisma.nft.findMany({
        where: {
          userId: input.userId,
          nftId: {
            in: input.nftIds,
          },
        },
      })

      if (nfts.length > 0)
        throw new TRPCError({
          message: `NFTs with id: ${nfts.map(
            (nft) => nft.nftId
          )} already exists`,
          code: 'BAD_REQUEST',
        })

      return await prisma.$transaction(
        input.nftIds.map((nftId) => {
          return prisma.nft.create({
            data: {
              nftId,
              userId: input.userId,
            },
          })
        })
      )
    }),
  removeNfts: authProcedure
    .input(
      z.object({
        userId: z.number(),
        nftIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { role } = ctx.user
      if (role !== Role.ADMIN)
        throw new TRPCError({
          message: `You don't have permission to remove NFTs`,
          code: 'UNAUTHORIZED',
        })

      return prisma.nft.deleteMany({
        where: {
          userId: input.userId,
          nftId: {
            in: input.nftIds,
          },
        },
      })
    }),
  addBalance: authProcedure
    .input(
      z.object({
        userId: z.number(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { role } = ctx.user
      if (role !== Role.ADMIN)
        throw new TRPCError({
          message: `You don't have permission to add balance`,
          code: 'UNAUTHORIZED',
        })

      return await prisma.balance.upsert({
        where: {
          userId: input.userId,
        },
        create: {
          userId: input.userId,
          amount: input.amount,
        },
        update: {
          amount: {
            increment: input.amount,
          },
        },
      })
    }),
  removeBalance: authProcedure
    .input(
      z.object({
        userId: z.number(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { role } = ctx.user
      if (role !== Role.ADMIN)
        throw new TRPCError({
          message: `You don't have permission to add balance`,
          code: 'UNAUTHORIZED',
        })

      return await prisma.balance.upsert({
        where: {
          userId: input.userId,
        },
        create: {
          userId: input.userId,
          amount: input.amount,
        },
        update: {
          amount: {
            decrement: input.amount,
          },
        },
      })
    }),
})
