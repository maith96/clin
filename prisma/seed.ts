import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main () {
  const patient1 = await prisma.patient.create({
    data: {
      user: {
        create: {
          email: 'alice@gmail.com',
          password: '12345678',
          firstName: 'Alice',
          middleName: 'Mary',
          lastName: 'Sally',
          nationalIdNumber: '321356788',
          contactNumber: '+254734987234',
          age: 3,
          gender: 'female',
          title: 'Mrs.',
          address: '',
          role: 'patient',
          status: 'active'

        }

      }
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })
