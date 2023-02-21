import { z } from 'zod'

console.log(process.env)
export const env = z
  .object({
    JWT_SECRET: z.string(),
    NODE_ENV: z.enum(['development', 'production']),
  })
  .parse(process.env)
