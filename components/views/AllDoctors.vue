<script setup lang="ts">
const props = defineProps({
  doctors: Object
})

const doctors = props.doctors
const columns = [
  {
    key: 'no',
    label: '#'
  },
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'firstName',
    label: 'First Name'
  },
  {
    key: 'middleName',
    label: 'Middle Name'
  },
  {
    key: 'lastName',
    label: 'Last Name'
  },
  {
    key: 'age',
    label: 'Age'
  },
  {
    key: 'createdAt',
    label: 'Registered'
  }
]

</script>

<template>
  <div class="my-3 bg-white border border-1 border-gray-200 shadow-sm m-auto">
    <h1 class="bg-orange-400 p-3 flex items-center text-lg"><UIcon name="i-heroicons-user-solid" class="mr-3"/> Patients</h1>
    <UTable :columns="columns" :rows="doctors" class="w-100 p-3 mb-10">
      <template #id-data="{ row }">
        <NuxtLink :to="`/doctors/${row.id}`" class="hover:text-primary-400">
          {{ row.id }}
        </NuxtLink>
      </template>
    </UTable>
    <UButton class="mx-3 my-5 bg-orange-400" @click="navigateTo('/patients/new')">
      New Patient
    </UButton>
  </div>
</template>

<style scoped>

</style>
