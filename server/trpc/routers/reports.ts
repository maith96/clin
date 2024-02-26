import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { usersRouter } from '~/server/trpc/routers/users'
import { patientsRouter } from '~/server/trpc/routers/patients'

export const reportsRouter = router({
  patient: publicProcedure
    .input(
      z.object({
        patientId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const patientReports = await ctx.prisma.report.findMany({
        where: {
          patientId: input.patientId
        }
      })
      if (!patientReports) {
        throw createError({ statusCode: 404, statusMessage: 'Failed to get reports of patient' })
      }
      return patientReports
    }),
  doctor: publicProcedure
    .input(
      z.object({
        doctorId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const patientReports = await ctx.prisma.report.findMany({
        where: {
          doctorId: input.doctorId
        }
      })
      if (!patientReports) {
        throw createError({ statusCode: 404, statusMessage: 'Failed to get reports of doctor' })
      }
      return patientReports
    }),
  create: publicProcedure.input(
    z.object({
      patientId: z.string(),
      doctorId: z.string(),
      illness: z.string(),
      symptoms: z.string(),
      prescription: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const report = await ctx.prisma.report.create({
      data: {
        ...input
      }
    })
    if (!report) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to create report' })
    }
    return { reportId: report.id }
  })
})

// export type definition of API
export type ReportsRouter = typeof reportsRouter
