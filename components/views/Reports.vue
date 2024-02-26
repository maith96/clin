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
  }
]

</script>

<template>
  <div class="my-3 bg-white border border-1 border-gray-200 shadow-sm md:w-[70%] m-auto">
    <div class="flex flex-col justify-between">
      <div>
        <h1 class="bg-cyan-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-clipboard-20-solid" class="mr-3"/>Reports</h1>

        <UTable :columns="columns" :rows="$attrs.reports" class="max-w-100 p-5" />
      </div>

      <div>
        <UButton @click="navigateTo('/patients/new')" class="mx-3 my-5 bg-cyan-400">
          New Report
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
