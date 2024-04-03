<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
const { $client } = useNuxtApp()
const res = await $client.patients.allIds.query()
const patientIds = res.map(d => `${d.user.firstName} ${d.user.middleName} ${d.user.lastName}`)

const state = reactive({
  patient: ''
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.patient) { errors.push({ path: 'patient', message: 'Required' }) }
  return errors
}
async function onSubmit (event: FormSubmitEvent<any>) {
  const fNames = event.data.patient.split(' ')
  const pa = res.find(u => (u.user.firstName === fNames[0]) && (u.user.middleName === fNames[1]) && (u.user.lastName === fNames[2]))
  const newAppointment = await $client.que.add.mutate({ patientId: pa?.id as string })
  if (newAppointment.appointment?.id) {
    await $client.sms.send.query({ text: `You have been added to the que list. Your sering time is: ${calcWaitTime(newAppointment.appointment.dateTime)}` })
    state.patient = ''
    emit('refreshAppointments')
    alert('Patient has been added to Que!')
    // const smsRes = await $client.sms.send.query({ text: 'you have been added to Que })
    // console.log(smsRes)
    isFormModalOpen.value = false
  } else {
    alert(newAppointment.message)
  }
}

const emit = defineEmits(['refreshAppointments'])

const isFormModalOpen = ref(false)

</script>

<template>
  <div>
    <UButton label="Add" class="m-5 border border-2 border-primary bg-white text-primary hover:bg-green-100" @click="isFormModalOpen = true" />
    <UModal v-model="isFormModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="font-bold text-lg text-center">
            Addd Patient to Que Form
          </h1>
          <UForm :validate="validate" :state="state" class="space-y-4 p-5" @submit="onSubmit">
            <UFormGroup label="Patient" name="role">
              <USelect v-model="state.patient" :options="patientIds" placeholder="Search.." />
            </UFormGroup>

            <UButton type="submit">
              Schedule Appointment
            </UButton>
          </UForm>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
