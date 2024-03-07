<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
const { $client } = useNuxtApp()
const res = await $client.patients.allIds.query()
const patientIds = res.map(d => d.id)

const state = reactive({
  patient: ''
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.patient) { errors.push({ path: 'patient', message: 'Required' }) }
  return errors
}
async function onSubmit (event: FormSubmitEvent<any>) {
  const newAppointment = await $client.appointments.addToQue.mutate({ patientId: event.data.patient })
  if (newAppointment.appointment?.id) {
    state.patient = ''
    emit('refreshAppointments')
    alert('Patient has been added to Que!')
    // const smsRes = await $client.sms.send.query({ text: 'you have been added to Que })
    // console.log(smsRes)
  } else {
    alert(newAppointment.message)
  }
}

const emit = defineEmits(['refreshAppointments'])
</script>

<template>
  <div class="my-5 bg-white border border-1 border-gray-200 shadow-sm flex-2 flex flex-col justify-between">
    <div>
      <h1 class="bg-green-400 p-5 flex items-center text-lg">
        <UIcon name="i-heroicons-calendar-days-16-solid" class="mr-3" /> New Appointment Form
      </h1>
    </div>
    <UForm :validate="validate" :state="state" class="space-y-4 p-5" @submit="onSubmit">
      <UFormGroup label="Patient" name="role">
        <USelect v-model="state.patient" :options="patientIds" placeholder="Search.." />
      </UFormGroup>

      <UButton type="submit">
        Schedule Appointment
      </UButton>
    </UForm>
  </div>
</template>
