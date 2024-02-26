<script setup lang="ts">

import UserForm from '~/components/forms/UserForm.vue'
import type { FormSubmitEvent } from '#ui/types'

const { $client } = useNuxtApp()

async function onSubmit (event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data.email)
  const responseData = await $client.users.create.mutate({ ...event.data })
  if (responseData) {
    const userId = responseData.userId
    const response = await $client.staffs.create.mutate({ userId })
    console.log(response)
    if (response.staffId) {
      await navigateTo(`/staff/${response.staffId}`)
    }
  }
}

</script>

<template>
  <div class="my-10 bg-white border border-1 border-brown-200 shadow-sm md:w-[70%] m-auto">
    <h1 class="bg-orange-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-pencil-square-solid" class="mr-3"/> Staff form</h1>
    <UserForm :onSubmit="onSubmit" />
  </div>

</template>

<style scoped>

</style>
