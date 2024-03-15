<script setup lang="ts">
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
    key: 'illness',
    label: 'Illness'
  },
  {
    key: 'symptoms',
    label: 'Symptoms'
  },
  {
    key: 'prescription',
    label: 'Prescription'
  },
  {
    key: 'dateTime',
    label: 'Date'
  },
  {
    key: 'actions',
    label: ''
  }
]
const props = defineProps({
  reports: Object
})
const page = ref(1)
const pageCount = 5
const rows = computed(() => toRef(props, 'reports').value?.slice((page.value - 1) * pageCount, (page.value * pageCount)))

</script>

<template>
  <div class="my-3 bg-white border border-1 border-gray-200 shadow-sm md:w-[70%] m-auto">
    <div class="flex flex-col justify-between">
      <div>
        <h1 class="bg-cyan-400 p-5 flex items-center text-lg">
          <UIcon name="i-heroicons-clipboard-20-solid" class="mr-3" />Medical Reports
        </h1>

        <UTable :columns="columns" :rows="rows" class="max-w-100 p-5">
          <template #actions-data="{ row }">
            <NuxtLink :to="`/certificates/${row.id}`" class="text-cyan-500 underline hover:text-cyan-800">
              View Certificate
            </NuxtLink>
          </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
          <UPagination v-model="page" :page-count="pageCount" :total="props.reports?.length" />
        </div>
      </div>

      <div>
        <!-- <UButton class="mx-3 my-5 bg-cyan-400" @click="navigateTo('/patients/new')">
          New Report
        </UButton> -->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
