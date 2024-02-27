<script setup lang="ts">
const props = defineProps({
  patients: Object
})

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
const page = ref(1)
const pageCount = 5
const rows = computed(() => toRef(props, 'patients').value?.slice((page.value - 1) * pageCount, (page.value * pageCount)))

</script>

<template>
  <div class="my-3 bg-white border border-1 border-gray-200 shadow-sm m-auto">
    <h1 class="bg-orange-400 p-3 flex items-center text-lg"><UIcon name="i-heroicons-user-solid" class="mr-3"/> Patients</h1>
    <UTable :columns="columns" :rows="rows" class="w-100 p-3 mb-10">
      <template #id-data="{ row }">
        <NuxtLink :to="`/patients/${row.id}`" class="hover:text-orange-400">
          {{ row.id }}
        </NuxtLink>
      </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="props.patients?.length" />
    </div>
    <UButton class="mx-3 my-5 bg-orange-600 hover:bg-orange-700" @click="navigateTo('/patients/new')">
      New Patient
    </UButton>
  </div>
</template>

<style scoped>

</style>
