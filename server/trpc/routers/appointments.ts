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
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.appointment.findMany({
      where: { status: 'scheduled' },
      include
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
        include
      })
      if (!patientAppointments) {
        throw createError({ statusCode: 404, statusMessage: 'Failed to get appointments of patient' })
      }
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
  updateSatus: publicProcedure.input(
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
    .query(({ input, ctx }) => {
      const doctorAppointments = ctx.prisma.appointment.findMany({
        where: {
          doctorId: input.doctorId,
          status: 'scheduled'
        },
        include
      })
      if (!doctorAppointments) {
        throw createError({ statusCode: 404, statusMessage: 'Failed to get appointments of doctor' })
      }
      return doctorAppointments
    }),

  doctorScheduleAtDate: publicProcedure.input(z.object({ dateTime: z.date() })).query(({ ctx, prisma }) => {

  })

  addToQue: publicProcedure.input(
    z.object({
      patientId: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    if (await patientHasAppointments(input.patientId, ctx.prisma)) {
      return { appointmentId: null, message: 'Patient has a scheduled appointment' }
    }

    const doctor = await availableDoctor(ctx.prisma)
    if (doctor) {
      const appointment1 = await createAppointment('scheduled', doctor.id, input.patientId, new Date(), ctx.prisma)
      return { appointmentId: appointment1.id }
    }

    const earliestAppointment = await getEarliestAppointment(ctx.prisma)
    if (earliestAppointment) {
      const dateTime = earliestAppointment.dateTime
      dateTime.setMinutes(earliestAppointment.dateTime.getMinutes() + 30)
      const appointment2 = await createAppointment('scheduled', earliestAppointment.doctorId, earliestAppointment.patientId, dateTime, ctx.prisma)
      return { appointmentId: appointment2.id }
    }
    return { appointmentId: null, message: 'Could not create appointment' }
  }),

  schedule: publicProcedure.input(z.object({
    patientId: z.string(),
    doctorId: z.string(),
    dateTime: z.date()
  })).mutation(async ({ ctx, input }) => {
    const appointment = await createAppointment('scheduled', input.doctorId, input.patientId,input.dateTime, ctx.prisma)
    return { id: appointment.id }
  })
})

async function getEarliestAppointment (prisma: PrismaClient) {
  const earliest = await prisma.appointment.findFirst({
    where: {
      OR: [
        { status: 'scheduled' },
        { status: 'inProgress' }
      ]
    },
    orderBy: {
      dateTime: 'asc'
    }
  })

  return earliest
}
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
async function patientHasAppointments (patientId: string, prisma: PrismaClient) {
  const appointments = await prisma.appointment.count({
    where: {
      patientId,
      OR: [
        { status: 'scheduled' },
        { status: 'inProgress' }
      ]
    }
  })
  return (appointments > 0)
}

async function availableDoctor (prisma: PrismaClient) {
  const doctor = await prisma.staff.findFirst({
    where: {
      user: {
        role: 'doctor'
      },
      NOT: {
        appointments: {
          some: {
            status: {
              in: ['scheduled', 'inProgress']
            }
          }
        }
      }
    }
  })

  return doctor
}

// export type definition of API
export type AppointmentsRouter = typeof appointmentsRouter
