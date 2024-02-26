<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
const { $client } = useNuxtApp()
const toast = useToast()
const res = await $client.patients.allIds.query()
const patientIds = res.map(d => d.id)
console.log(patientIds)

const state = reactive({
  patient: ''
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.patient) { errors.push({ path: 'patient', message: 'Required' }) }
  return errors
}
async function onSubmit (event: FormSubmitEvent<any>) {
  const res = await $client.appointments.create.mutate({ patientId: event.data.patient })
  if (res.appointmentId) {
    state.patient = ''
    alert('Appointment has been set successfully!')
  } else {
    alert(res.message)
  }
}
</script>

<template>
  <div class="my-5 bg-white border border-1 border-gray-200 shadow-sm flex-2 flex flex-col justify-between">
    <div>
      <h1 class="bg-green-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-calendar-days-16-solid" class="mr-3"/> New Appointment Form</h1>
    </div>
    <UForm :validate="validate" :state="state" class="space-y-4 p-5" @submit="onSubmit">
      <UFormGroup label="Patient" name="role">
        <USelect v-model="state.patient" :options="patientIds" placeholder="Search.."/>
      </UFormGroup>

      <UButton type="submit">
        Schedule Appointment
      </UButton>
    </UForm>
  </div>
</template>
