import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const patientsRouter = router({
  allIds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.patient.findMany({
      select: { id: true }
    })
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.patient.findMany({ include: { user: true } })
  }),

  get: publicProcedure.input(
    z.object({
      id: z.string()
    })
  ).query(async ({ input, ctx }) => {
    const patient = await ctx.prisma.patient.findUnique({
      where: { id: input.id },
      include: { user: true, appointments: true, reports: true }
    })
    if (!patient) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create patient' })
    }
    return { id: patient.id, user: patient.user, appointments: patient.appointments }
  }),

  create: publicProcedure.input(
    z.object({
      userId: z.string(),
      allergies: z.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const patient = await ctx.prisma.patient.create({
      data: { ...input }
    })

    if (!patient) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create patient' })
    }
    return { patientId: patient.id }
  })
})

export type PatientsRouter = typeof patientsRouter
