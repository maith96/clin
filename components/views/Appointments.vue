<script setup lang="ts">
import AppointmentForm from '~/components/forms/AppointmentForm.vue';
import { onlyDateTime } from '~/utils/formatTime'

const props = defineProps({
  access: String,
  appointments: Object
})

const columns = [
  {
    key: 'no',
    label: '#'
  },
  {
    key: 'id',
    label: 'ID'
  }
]
if (props.access === 'all') {
  columns.push({
    key: 'doctorNames',
    label: 'Doctor'
  })
  columns.push({
    key: 'patientNames',
    label: 'Patient'
  })
} else if (props.access === 'doctor') {
  columns.push({
    key: 'patientNames',
    label: 'Patient'
  })
} else {
  columns.push({
    key: 'doctorNames',
    label: 'Doctor'
  })
}
columns.push({
  key: 'status',
  label: 'Status'
})

columns.push({
  key: 'dateTime',
  label: props.access === 'all' ? 'Wait Time' : 'Date'
})
columns.push({
  key: 'actions',
  label: ''
})
const emit = defineEmits(['refreshAppointments', 'cancelAppointment'])

const page = ref(1)
const pageCount = 5
const rows = computed(() => toRef(props, 'appointments').value?.slice((page.value - 1) * pageCount, (page.value * pageCount)))
</script>

<template>
  <div class="my-5 bg-white border border-1 border-gray-200 shadow-sm flex-1 flex flex-col justify-between">
    <div>
      <h1 class="bg-green-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-calendar-days-16-solid" class="mr-3"/> {{ props.access === 'all'? 'Que List' : 'Scheduled Appointments' }}</h1>
      <UTable :columns="columns" :rows="rows" class="max-w-100 p-5">
        <template #actions-data="{ row }">
          <UButton label="Cancel" icon="i-heroicons-x-mark-16-solid" class="bg-red-500 hover:bg-red-600" @click="emit('cancelAppointment', row.id)"/>
        </template>
      </UTable>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="props.appointments?.length" />
      </div>
    </div>
    <div>
      <AppointmentForm class="mx-3 my-5" @refresh-appointments="emit('refreshAppointments')" />
    </div>
  </div>
</template>

<style scoped>

</style>
