<script setup lang="ts">
import fs from 'fs'
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const { $client } = useNuxtApp()
const { id } = useRoute().params

const userData = await $client.staffs.get.query({ id: id as string })
console.log(userData)

async function onUploadSignature (event:FormSubmitEvent<any>) {
  console.log(event.data)
  // const res = await $fetch('/api/upload', { body: event.data, method: 'post' })
  // console.log(res)
}

const state = reactive({
  file: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.file) { errors.push({ path: 'file', message: 'Required' }) }
  return errors
}

function onFileChaged (event: any) {
  console.log('changed')
  const file = event.target.files[0]
}
</script>

<template>
  <div
    class="my-5 bg-white border border-1 border-gray-100 md:w-[70%] m-auto
       shadow-sm flex-2"
  >
    <h1 class="bg-orange-400 p-5 flex items-center text-lg">
      <UIcon name="i-heroicons-user-20-solid" class="mr-3" /> Profile
    </h1>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Names: </b>
      <span class="flex-1">{{ userData?.user.firstName }} {{ userData?.user.middleName }} {{ userData?.user.lastName }}</span>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Age: </b>
      <span class="flex-1">{{ userData?.user.age }}</span>
    </div>

    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Email: </b>
      <p class="flex-1">
        {{ userData?.user.email }}
      </p>
    </div>

    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Contact Number: </b>
      <p class="flex-1">
        {{ userData?.user.contactNumber }}
      </p>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Address: </b>
      <p class="flex-1">
        {{ userData?.user.address }}
      </p>
    </div>

    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Date Registered: </b>
      <p class="flex-1">
        {{ userData?.user.createdAt }}
      </p>
    </div>

    <UForm :validate="validate" :state="state" class="space-y-4 p-5" @submit="onUploadSignature">
      <UFormGroup label="Signature" name="file">
        <UInput v-model="state.file" type="file" @change="onFileChaged" />
      </UFormGroup>

      <UButton type="submit">
        Submit
      </UButton>
    </uform>
  </div>
</template>

<style scoped>

</style>
