import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const doctorsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const doctors = await ctx.prisma.staff.findMany({
      where: {
        user: {
          role: 'doctor'
        }
      },
      include: { user: true }
    })

    return doctors
  }),

  get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const doctor = await ctx.prisma.staff.findUnique({
      where: { id: input.id },
      include: { user: true, appointments: true, reports: true }
    })
    if (!doctor) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create patient' })
    }
    return { id: doctor.id, user: doctor.user, appointments: doctor.appointments }
  })
})

export type DoctorsRouter = typeof doctorsRouter
