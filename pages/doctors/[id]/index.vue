<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { useUserStore } from '../../../stores/user'
import Appointments from '~/components/views/Appointments.vue'
import Reports from '~/components/views/Reports.vue'

const { $client } = useNuxtApp()
const { id } = useRoute().params
const userStore = useUserStore()
const { session } = await useSession()

if ((session.value?.user?.role !== 'doctor')) {
  navigateTo('/')
}
// if (loggedInUser?.value.id !== id) {
//   navigateTo('/')
// }
if (!userStore.user) {
  navigateTo('/')
}
const getAppointmentStatus = (date: Date) => (date > new Date()) ? 'scheduled' : 'inProgress'

const currentServingPatient = ref<any>(null)
const doctorAppointments = ref<any>(await getAppointments())
const reports = ref<any>(await getReports())

// const doctorReports = ref<any>(await getReports())

async function getAppointments () {
  const data = await $client.appointments.doctor.query({ doctorId: id as string })
  return (data ?? []).map(a => parseAppointment(a, (data.indexOf(a) + 1)))
}
async function getReports () {
  const data = await $client.reports.doctor.query({ doctorId: id as string })
  return (data ?? [])
}

function parseAppointment (appointment:any, no:number) {
  if (getAppointmentStatus(appointment.dateTime) === 'inProgress') {
    const ress = async () => await $client.sms.send.query({ text: 'The doctor is ready to see you now' })
    console.log(ress)

    currentServingPatient.value = { id: appointment.patientId, appointmentId: appointment.id, ...appointment.patient.user }
  }

  return {
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    id: appointment.id,
    status: getAppointmentStatus(appointment.dateTime),
    no,
    doctorNames: userStore.user?.names,
    patientNames: appointment.patient.user.firstName + ' ' + appointment.patient.user.middleName + ' ' + appointment.patient.user.lastName,
    dateTime: appointment.dateTime.toDateString() + ' ' + appointment.dateTime.toLocaleTimeString()
  }
}
async function cancelAppointment (id: string) {
  const canceledAppointment = await $client.appointments.cancel.mutate({ id })
  if (canceledAppointment.id) {
    await $client.sms.send.query({ text: 'Cancelled Appointment: You\'re appointment with a doctor has been canceled' })
    alert('appoitnment has been cancelled')
  } else {
    console.log('failed to delete appointment')
  }
}
console.log(doctorAppointments.value)

</script>

<template>
  <div>
    <div class="flex  gap-5  md:w-[70%] m-auto ">
      <Appointments access="doctor" :appointments="doctorAppointments" @cancel-appointment="cancelAppointment" />
      <div>
        <!-- <ReportForm :patient="currentServingPatient" :on-s-submit="onSubmitPatientReport" /> -->
      </div>
    </div>
    <Reports :reports="reports" />
  </div>
</template>

<style scoped>

</style>
