<script setup lang="ts">
import type { FormError } from '#ui/types'

const roles = ['doctor', 'patient', 'otherStaff', 'admin', 'receptionist']
const genders = ['Male', 'Female']
const titles = ['Mr.', 'Mrs.', 'Dr.']

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  middleName: undefined,
  email: undefined,
  password: undefined,
  contactNumber: undefined,
  age: undefined,
  address: undefined,
  status: 'active',
  role: roles[1],
  gender: genders[0],
  title: titles[0],
  profilePhoto: ''
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.firstName) { errors.push({ path: 'firstName', message: 'Required' }) }
  if (!state.lastName) { errors.push({ path: 'lastName', message: 'Required' }) }
  if (!state.middleName) { errors.push({ path: 'middleName', message: 'Required' }) }
  if (!state.email) { errors.push({ path: 'email', message: 'Required' }) }
  if (!state.password) { errors.push({ path: 'password', message: 'Required' }) }
  if (!state.contactNumber) { errors.push({ path: 'contactNumber', message: 'Required' }) }
  if (!state.age) { errors.push({ path: 'age', message: 'Required' }) }
  if (!state.address) { errors.push({ path: 'address', message: 'Required' }) }
  if (!state.status) { errors.push({ path: 'status', message: 'Required' }) }
  if (!state.role) { errors.push({ path: 'role', message: 'Required' }) }
  if (!state.gender) { errors.push({ path: 'gender', message: 'Required' }) }
  if (!state.title) { errors.push({ path: 'title', message: 'Required' }) }
  return errors
}

</script>

<template>
  <UForm :validate="validate" :state="state" class="space-y-4 p-5" @submit="$attrs.onSubmit">
    <UFormGroup label="FirstName" name="firstName">
      <UInput v-model="state.firstName" />
    </UFormGroup>

    <UFormGroup label="LastName" name="lastName">
      <UInput v-model="state.lastName" type="text" />
    </UFormGroup>

    <UFormGroup label="MiddleName" name="middleName">
      <UInput v-model="state.middleName" type="text" />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="text" />
    </UFormGroup>

    <UFormGroup label="ContactNumber" name="contactNumber">
      <UInput v-model="state.contactNumber" type="string" />
    </UFormGroup>

    <UFormGroup label="Age" name="age">
      <UInput v-model="state.age" type="number" />
    </UFormGroup>

    <UFormGroup label="Address" name="address">
      <UInput v-model="state.address" />
    </UFormGroup>

    <UFormGroup label="Role" name="role">
      <USelect v-model="state.role" :options="roles" />
    </UFormGroup>

    <UFormGroup label="Gender" name="gender">
      <USelect v-model="state.gender" :options="genders" />
    </UFormGroup>

    <UFormGroup label="Title" name="title">
      <USelect v-model="state.title" :options="titles" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
