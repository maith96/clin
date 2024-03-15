<script setup lang="ts">
import type { FormError } from '#ui/types'
const { $client } = useNuxtApp()

const emit = defineEmits(['refreshAppointments'])

async function onSubmitPatientReport () {
  if (validate(state).length > 0) { return }
  // console.log({ ...state })

  const res = await $client.reports.create.mutate({ ...state, patientId: selectedAppointment.value?.patientId, doctorId: selectedAppointment.value?.doctorId })
  if (res.reportId) {
    emit('refreshAppointments')
    await $client.appointments.completed.mutate({ id: selectedAppointment.value?.id })
    alert('Report added succsfully. You can now view the certificate.')
  }
  modalIsOpen.value = false
}

const state = reactive({
  illness: '',
  symptoms: '',
  prescription: ''
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.illness) { errors.push({ path: 'illness', message: 'Required' }) }
  if (!state.symptoms) { errors.push({ path: 'symptoms', message: 'Required' }) }
  if (!state.prescription) { errors.push({ path: 'prescription', message: 'Required' }) }
  return errors
}

const props = defineProps({
  selectedAppointment: Object
})

// let modalIsOpen = toRef(props, 'isReportFormModalOpen')
const modalIsOpen = ref(false)
const selectedAppointment = toRef(props, 'selectedAppointment')

</script>

<template>
  <UButton label="New Report" class="bg-white text-cyan-500 border border-2 border-cyan-400 hover:bg-cyan-100" @click="modalIsOpen=true" />

  <UModal v-model="modalIsOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h1 class="font-bold text-lg text-center">
          <em>{{ selectedAppointment?.patientNames }}</em> Report
        </h1>
      </template>

      <div>
        <UForm :validate="validate" :state="state" class="space-y-4 p-5">
          <UFormGroup label="Illness" name="Illness">
            <UInput v-model="state.illness" />
          </UFormGroup>

          <UFormGroup label="Symptoms" name="symptoms">
            <UInput v-model="state.symptoms" type="text" />
          </UFormGroup>

          <UFormGroup label="Prescription" name="prescription">
            <UInput v-model="state.prescription" type="text" />
          </UFormGroup>

          <UButton type="submit" class="bg-cyan-600 hover:bg-cyan-700" @click="onSubmitPatientReport">
            Submit report
          </UButton>
        </UForm>
      </div>

      <template #footer />
    </UCard>
  </UModal>
</template>
