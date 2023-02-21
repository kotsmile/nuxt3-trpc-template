import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { type User } from '@prisma/client'
import { env } from '@/server/env'

import { middleware, publicProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'

export enum Status {
  PENDING,
  CANCELED,
  CLOSED,
}

export enum Role {
  USER,
  ADMIN,
}

export type UserJWT = Pick<User, 'username' | 'role' | 'id'>

export const now = () => Math.floor(Date.now() / 1000)

export const saltPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const verifyPassword = async (
  inputPassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(inputPassword, userPassword)
}

export const createJWT = async (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    env.JWT_SECRET
  )
}

export const verifyJWT = async (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as UserJWT
}

const isAuth = middleware(async ({ ctx, next }) => {
  const { user } = ctx
  console.log({ user })
  if (user == null) throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next({
    ctx: {
      user,
    },
  })
})

export const authProcedure = publicProcedure.use(isAuth)
