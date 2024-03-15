import { z } from 'zod'
import type { PrismaClient } from '@prisma/client'
import { router, publicProcedure } from '../trpc'

export const queRouter = router({
  add: publicProcedure.input(
    z.object({
      patientId: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    if (await patientAlreadyInQue(input.patientId, ctx.prisma)) {
      return { appointmentId: null, message: 'Patient is already in the que list!' }
    }

    const doctor = await availableDoctor(ctx.prisma)
    if (doctor) {
      const appointment1 = await createAppointment('scheduled', doctor.id, input.patientId, new Date(), ctx.prisma, true)
      // await sendSMS('25474875877')
      return { appointment: appointment1 }
    }

    const earliestAppointment = await getEarliestAppointment(ctx.prisma)
    if (earliestAppointment) {
      const dateTime = earliestAppointment.dateTime
      dateTime.setMinutes(earliestAppointment.dateTime.getMinutes() + 30)
      const appointment2 = await createAppointment('scheduled', earliestAppointment.doctorId, input.patientId, dateTime, ctx.prisma, true)
      // await sendSMS('25474875877')
      return { appointment: appointment2 }
    }
    return { appointment: null, message: 'Could not create appointment' }
  }),

  patient: publicProcedure.input(z.object({ patientId: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.appointment.findFirst({
      where: {
        AND: [
          { patientId: input.patientId },
          { inQue: true },
          { status: 'scheduled' }
        ]
      },
      select: {
        id: true,
        dateTime: true
      }
    })
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    const quedAppointments = await ctx.prisma.appointment.findMany({
      where: {
        inQue: true,
        status: 'scheduled'
      },
      select: {
        id: true,
        status: true,
        dateTime: true,
        patient: { select: { id: true, user: true } },
        doctor: { select: { id: true, user: true } }
      }
    })
    return quedAppointments.map((ap) => {
      return {
        id: ap.id,
        patientId: ap.patient.id,
        doctorId: ap.doctor.id,
        doctorNames: [ap.doctor.user.firstName, ap.doctor.user.middleName, ap.doctor.user.lastName].join(' '),
        patientNames: [ap.patient.user.firstName, ap.patient.user.middleName, ap.patient.user.lastName].join(' '),
        status: ap.status,
        dateTime: ap.dateTime
      }
    })
  })
})

async function patientAlreadyInQue (patientId: string, prisma: PrismaClient) {
  const appointments = await prisma.appointment.count({
    where: {
      patientId,
      inQue: true,
      status: 'scheduled'
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

async function getEarliestAppointment (prisma: PrismaClient) {
  const earliest = await prisma.appointment.findFirst({
    where: {
      inQue: true,
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
async function createAppointment (status:string, doctorId:string, patientId:string, dateTime:Date, prisma: PrismaClient, inQue: boolean = false) {
  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId,
      status,
      dateTime,
      inQue
    }
  })
  if (!appointment) { throw createError({ statusCode: 404, statusMessage: 'Failed to create appointment' }) }

  return appointment
}

export type QueRouter = typeof queRouter
