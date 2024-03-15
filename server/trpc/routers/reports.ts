import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const reportsRouter = router({
  get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.report.findUnique({
      where: { id: input.id },
      include: {
        doctor: {
          include: { user: true }
        },
        patient: {
          include: { user: true }
        }
      }
    })
  }),
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
        },
        orderBy: {
          dateTime: 'desc'
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
