<script setup lang="ts">
import QueForm from '~/components/forms/QueForm.vue'

const { $client } = useNuxtApp()

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
    key: 'doctorNames',
    label: 'Doctor'
  },
  {
    key: 'patientNames',
    label: 'Patient'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'dateTime',
    label: 'Wait Time'
  },
  {
    key: 'actions',
    label: ''
  }
]

const { data: quedAppointments, refresh } = useAsyncData('appointments', async () => {
  const res = await $client.que.all.useQuery()
  console.log(res.data.value)

  return res.data.value?.map((a) => {
    return { ...a, dateTime: calcWaitTime(a.dateTime), no: (res.data.value ?? []).indexOf(a) + 1 }
  })
})

const page = ref(1)
const pageCount = 5
const rows = computed(() => quedAppointments.value?.slice((page.value - 1) * pageCount, (page.value * pageCount)))
const emit = defineEmits(['cancelAppointment'])
</script>

<template>
  <div class="my-5 bg-white border border-1 border-gray-200 shadow-sm flex-1 flex flex-col justify-between">
    <div>
      <h1 class="bg-green-400 p-5 flex items-center text-lg">
        <UIcon name="i-heroicons-calendar-days-16-solid" class="mr-3" />
        Que List
      </h1>
      <UTable :columns="columns" :rows="rows" class="max-w-100 p-5">
        <template #actions-data="{ row }">
          <UButton label="Cancel" icon="i-heroicons-x-mark-16-solid" class="bg-white text-red-500 border border-2 border-red-400 hover:bg-red-100" @click="emit('cancelAppointment', row.id)" />
        </template>
      </UTable>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="quedAppointments?.length" />
      </div>
    </div>
    <div>
      <QueForm @refresh-appointments="refresh()" />
    </div>
  </div>
</template>

<style scoped>

</style>
