import { z } from 'zod'
import twilio from 'twilio'
import { router, publicProcedure } from '~/server/trpc/trpc'

const accSsid = 'ACe144502ca791f870546d403411b46bca'
const authToken = '6d1e2a79999f472de87ec41a3b60c65b'
const client = twilio(accSsid, authToken)

export const smsRouter = router({
  send: publicProcedure.input(z.object({
    text: z.string()
  })).query(async ({ input }) => {
    try {
      const message = await client.messages.create({
        body: input.text,
        to: '+254748075877',
        from: '+15169792659'
      })
      return { message }
    } catch (error) {
      return { message: 'error sending sms: ' + error }
    }
  })
})

export type SmsRouter = typeof smsRouter
