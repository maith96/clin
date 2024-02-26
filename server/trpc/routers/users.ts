import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const usersRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany()
  }),

  create: publicProcedure.input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      middleName: z.string(),
      email: z.string(),
      password: z.string(),
      contactNumber: z.number(),
      age: z.number(),
      weight: z.number(),
      height: z.number(),
      gender: z.string(),
      address: z.string(),
      title: z.string(),
      role: z.string(),
      status: z.string(),
      profilePhoto: z.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.create(
      {
        data: { ...input }
      })

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create user' })
    }
    return { userId: user.id }
  })
})

export type UsersRouter = typeof usersRouter
