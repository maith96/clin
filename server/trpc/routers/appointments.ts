import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { publicProcedure, router } from '../trpc'

const include = {
  doctor: {
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          middleName: true
        }
      }
    }
  },
  patient: {
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          middleName: true
        }
      }
    }
  }
}
export const appointmentsRouter = router({
  cancel: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.appointment.delete({ where: { id: input.id } })
  }),

  completed: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const ap = await ctx.prisma.appointment.update({
      where: { id: input.id },
      data: {
        inQue: false,
        status: 'completed'
      }
    })
    return ap
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const all = await ctx.prisma.appointment.findMany({
      where: { status: 'scheduled' },
      orderBy: {
        dateTime: 'asc'
      },
      include
    })
    return all.map((ap) => {
      return {
        id: ap.id,
        patientId: ap.patientId,
        doctorId: ap.doctorId,
        doctorNames: [ap.doctor.user.firstName, ap.doctor.user.middleName, ap.doctor.user.lastName].join(' '),
        patientNames: [ap.patient.user.firstName, ap.patient.user.middleName, ap.patient.user.lastName].join(' '),
        status: ap.status,
        dateTime: ap.dateTime
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
      const patientAppointments = await ctx.prisma.appointment.findMany({
        where: {
          patientId: input.patientId,
          status: 'scheduled'
        },
        orderBy: {
          dateTime: 'asc'
        },
        include
      })
      if (!patientAppointments) {
        throw createError({ statusCode: 404, statusMessage: 'Failed to get appointments of patient' })
      }
      checkDates(patientAppointments, ctx.prisma)
      return patientAppointments.map((ap) => {
        return {
          id: ap.id,
          patientId: ap.patientId,
          doctorId: ap.doctorId,
          doctorNames: [ap.doctor.user.firstName, ap.doctor.user.firstName, ap.doctor.user.firstName].join(' '),
          status: ap.status,
          dateTime: ap.dateTime
        }
      })
    }),
  updateStatus: publicProcedure.input(
    z.object({
      id: z.string(),
      status: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const updatedAppointment = await ctx.prisma.appointment.update({
      where: { id: input.id },
      data: { status: input.status }
    })
    if (!updatedAppointment) {
      throw createError({ statusCode: 404, statusMessage: 'Failed to update appointment status' })
    }
    return { id: updatedAppointment.id }
  }),

  doctor: publicProcedure
    .input(
      z.object({
        doctorId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const doctorAppointments = await ctx.prisma.appointment.findMany({
        where: {
          doctorId: input.doctorId,
          status: 'scheduled'
        },
        orderBy: {
          dateTime: 'asc'
        },
        include
      })
      if (!doctorAppointments) {
        throw createError({ statusCode: 404, statusMessage: 'Failed to get appointments of doctor' })
      }
      checkDates(doctorAppointments, ctx.prisma)
      return doctorAppointments
    }),

  doctorScheduleAtDate: publicProcedure.input(
    z.object({ dateTime: z.date(), doctorId: z.string() })).query(async ({ ctx, input }) => {
    const docsAppointments = await ctx.prisma.appointment.findMany({ where: { doctorId: input.doctorId as string } })
    const scheduled: Array<any> = []

    docsAppointments.forEach((dap) => {
      if (dap.dateTime.toDateString() === input.dateTime.toDateString()) {
        scheduled.push(dap.dateTime.toLocaleTimeString())
      }
    })
    return scheduled
  }),
  schedule: publicProcedure.input(z.object({
    patientId: z.string(),
    doctorId: z.string(),
    dateTime: z.date()
  })).mutation(async ({ ctx, input }) => {
    const appointment = await createAppointment('scheduled', input.doctorId, input.patientId, input.dateTime, ctx.prisma)
    return appointment
  })
})

async function createAppointment (status:string, doctorId:string, patientId:string, dateTime:Date, prisma: PrismaClient) {
  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId,
      status,
      dateTime
    }
  })
  if (!appointment) { throw createError({ statusCode: 404, statusMessage: 'Failed to create appointment' }) }

  return appointment
}

function checkDates (appointments: any, prisma: PrismaClient) {
  appointments.forEach(async (ap: any) => {
    if (ap.inQue === true) {
      if (hasPassedBy30Minutes(ap.dateTime)) {
        await prisma.appointment.update({
          where: { id: ap.id },
          data: { status: 'completed', inQue: false }
        })
      }
    } else if (ap.dateTime < Date.now()) {
      await prisma.appointment.update({
        where: { id: ap.id },
        data: { status: 'completed', inQue: false }
      })
    }
  })
}
function hasPassedBy30Minutes (scheduledDatetime: Date) {
  // Convert scheduledDatetime to milliseconds since Epoch
  const scheduledTime = new Date(scheduledDatetime).getTime()

  // Get current time in milliseconds since Epoch
  const currentTime = new Date().getTime()

  // Calculate the difference in milliseconds
  const timeDifference = currentTime - scheduledTime

  // Check if the time difference is greater than or equal to 30 minutes (in milliseconds)
  return timeDifference >= 30 * 60 * 1000
}
// export type definition of API
export type AppointmentsRouter = typeof appointmentsRouter
