import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const usersRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany()
  }),
  authen: publicProcedure.input(
    z.object({
      email: z.string(),
      password: z.string()
    })
  ).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
        password: input.password
      },
      select: {
        firstName: true,
        lastName: true,
        role: true,
        Patient: {
          select: { id: true }
        },
        Staff: {
          select: { id: true }
        }
      }
    })
    console.log(user)

    return user
  }),
  create: publicProcedure.input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      middleName: z.string(),
      email: z.string(),
      password: z.string(),
      contactNumber: z.string(),
      age: z.number(),
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
