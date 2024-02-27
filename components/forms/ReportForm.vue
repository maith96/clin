<script setup lang="ts">
import type { FormError } from '#ui/types'

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

</script>

<template>
  <div class="my-5 bg-white border border-1 border-gray-200 shadow-sm flex-2 flex flex-col justify-between min-w-[400px]">
    <div>
      <h1 class="bg-cyan-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-calendar-days-16-solid" class="mr-3" />{{ $attrs.patient?.firstName }}'s Report</h1>
    </div>
    <UForm :validate="validate" :state="state" @submit="$attrs.onSSubmit" class="space-y-4 p-5">
      <UFormGroup label="Illness" name="Illness">
        <UInput v-model="state.illness" />
      </UFormGroup>

      <UFormGroup label="Symptoms" name="symptoms">
        <UInput v-model="state.symptoms" type="text" />
      </UFormGroup>

      <UFormGroup label="Prescription" name="prescription">
        <UInput v-model="state.prescription" type="text" />
      </UFormGroup>

      <UButton type="submit" class="bg-cyan-600 hover:bg-cyan-700">
        Submit report
      </UButton>
    </UForm>
  </div>
</template>
