<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import Appointments from '~/components/views/Appointments.vue'
import Reports from '~/components/views/Reports.vue'
import ReportForm from '~/components/forms/ReportForm.vue'

const { $client } = useNuxtApp()
const { id } = useRoute().params

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
    currentServingPatient.value = { id: appointment.patientId, appointmentId: appointment.id, ...appointment.patient.user }
  }

  return {
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    id: appointment.id,
    status: getAppointmentStatus(appointment.dateTime),
    no,
    doctorNames: appointment.doctor.user.firstName + ' ' + appointment.doctor.user.middleName + ' ' + appointment.doctor.user.lastName,
    patientNames: appointment.patient.user.firstName + ' ' + appointment.patient.user.middleName + ' ' + appointment.patient.user.lastName,
    dateTime: appointment.dateTime.toDateString() + ' ' + appointment.dateTime.toLocaleTimeString()
  }
}

async function onSubmitPatientReport (event: FormSubmitEvent<any>) {
  const data = { ...event.data }
  const res = await $client.reports.create.mutate({ ...data, patientId: currentServingPatient.value?.id, doctorId: id })
  if (res.reportId) {
    await $client.appointments.updateSatus.mutate({ id: currentServingPatient.value?.appointmentId, status: 'completed' })
    doctorAppointments.value = await getAppointments()
    reports.value = await getReports()
  }
}

</script>

<template>
  <div class="flex  gap-5  md:w-[70%] m-auto ">
    <Appointments access="doctor" :appointments="doctorAppointments" />
    <div>
      <ReportForm :patient="currentServingPatient" :onSSubmit="onSubmitPatientReport" />
    </div>

  </div>
  <Reports :reports="reports"/>
</template>

<style scoped>

</style>
