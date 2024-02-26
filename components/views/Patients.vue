<script setup lang="ts">
const props = defineProps({
  patients: Object
})
const patients = props.patients

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
    key: 'height',
    label: 'Height (metres)'
  },
  {
    key: 'weight',
    label: 'Weight (kg)'
  },
  {
    key: 'age',
    label: 'Age'
  },
  {
    key: 'createdAt',
    label: 'Date Created'
  }
]

</script>

<template>
  <div class="my-3 bg-white border border-1 border-gray-200 shadow-sm">
    <h1 class="bg-orange-400 p-3 flex items-center text-lg"><UIcon name="i-heroicons-user-solid" class="mr-3"/> Patients</h1>
    <UTable :columns="columns" :rows="patients" class="w-100 p-3 mb-10">
      <template #id-data="{ row }">
        <NuxtLink :to="`/patients/${row.id}`" class="hover:text-primary-400">
          {{ row.id }}
        </NuxtLink>
      </template>
    </UTable>
    <UButton @click="navigateTo('/patients/new')" class="mx-3 my-5 bg-orange-400">
      New Patient
    </UButton>
  </div>
</template>

<style scoped>

</style>
