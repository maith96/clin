<script setup lang="ts">

import UserForm from '~/components/forms/UserForm.vue'
import type { FormSubmitEvent } from '#ui/types'

const { $client } = useNuxtApp()

async function onSubmit (event: FormSubmitEvent<any>) {
  // Do something with data
  const responseData = await $client.users.create.mutate({ ...event.data })
  if (responseData) {
    const userId = responseData.userId
    const response = await $client.patients.create.mutate({ userId, allergies: '' })
    if (response.patientId) {
      await navigateTo(`/patients/${response.patientId}`)
    }
  }
}

</script>

<template>
  <div class="my-10 bg-white border border-1 border-gray-200 shadow-sm md:w-[70%] m-auto">
    <h1 class="bg-purple-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-pencil-square-solid" class="mr-3"/> Doctor Form</h1>
    <UserForm :onSubmit="onSubmit" />
  </div>

</template>

<style scoped>

</style>
