import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const staffsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.staff.findMany({ include: { user: true } })
  }),

  get: publicProcedure.input(
    z.object({
      id: z.string()
    })
  ).query(async ({ input, ctx }) => {
    const staff = await ctx.prisma.staff.findUnique({
      where: { id: input.id },
      include: { user: true, appointments: true, reports: true }
    })
    if (!staff) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create patient' })
    }
    return { id: staff.id, user: staff.user, appointments: staff.appointments }
  }),

  create: publicProcedure.input(
    z.object({
      userId: z.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const staff = await ctx.prisma.staff.create({
      data: { ...input }
    })

    if (!staff) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create Staff' })
    }
    return { staffId: staff.id }
  })
})

export type StaffsRouter = typeof staffsRouter
