<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { session, update } = await useSession()

const { $client } = useNuxtApp()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

const error = ref('')

const userStore = useUserStore()

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with data
  const user = await $client.users.authen.query({ ...event.data })
  if (user) {
    console.log(user)

    if (user.role === 'patient') {
      userStore.signIn({
        names: `${user.firstName} ${user.lastName}`,
        role: user.role,
        id: user.Patient?.id ?? ''
      })
      await update({
        user: {
          names: `${user.firstName} ${user.lastName}`,
          role: user.role,
          id: user.Patient?.id ?? ''
        }
      })
      return navigateTo(`/patients/${user.Patient?.id}`)
    } else if (user.role === 'doctor') {
      userStore.signIn({
        names: `${user.firstName} ${user.lastName}`,
        role: user.role,
        id: user.Patient?.id ?? ''
      })
      await update({
        user: {
          names: `${user.firstName} ${user.lastName}`,
          role: user.role,
          id: user.Patient?.id ?? ''
        }
      })
      return navigateTo(`/doctors/${user.Staff?.id}`)
    } else if (user.role === 'receptionist') {
      userStore.signIn({
        names: `${user.firstName} ${user.lastName}`,
        role: user.role,
        id: user.Staff?.id ?? ''
      })
      await update({
        user: {
          names: `${user.firstName} ${user.lastName}`,
          role: user.role,
          id: user.Patient?.id ?? ''
        }
      })
      return navigateTo('/receptionist')
    }
  } else {
    error.value = 'Invalid credentials'
  }
}

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4 p-5" @submit="onSubmit">
    <p class="text-red-400">
      {{ error }}
    </p>
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
