import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { usersRouter } from '~/server/trpc/routers/users'
import { patientsRouter } from '~/server/trpc/routers/patients'
import { appointmentsRouter } from '~/server/trpc/routers/appointments'
import { reportsRouter } from '~/server/trpc/routers/reports'
import { doctorsRouter } from '~/server/trpc/routers/doctors'
import { staffsRouter } from '~/server/trpc/routers/staffs'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish()
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        time: new Date()
      }
    }),
  users: usersRouter,
  patients: patientsRouter,
  appointments: appointmentsRouter,
  reports: reportsRouter,
  doctors: doctorsRouter,
  staffs: staffsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
