<script setup lang="ts">

const isFormModalOpen = ref(false)
const { id } = useRoute().params
const { $client } = useNuxtApp()
const emit = defineEmits(['refreshAppointments'])

const doctorRes = await $client.doctors.getAll.useQuery()
const doctors = doctorRes.data.value?.map((d) => {
  return {
    id: d.id,
    name: [d.user.firstName, d.user.middleName, d.user.lastName].join(' ')
  }
})

const availableTimes = () => {
  const t = []
  for (let i = 8; i < 17; i++) {
    t.push({
      id: `T${(i < 10 ? '0' : '') + i}:00`,
      name: `T${(i < 10 ? '0' : '') + i}:00`
    })
  }

  return t
}

const selectedDate = ref('2024-02-29')
const selectedTime = ref(availableTimes()[0].id)
const selectedDoctor = ref(doctors ? doctors[0].id : undefined)
const isDateValid = computed(() => !(new Date(selectedDate.value) < new Date()))

const onSubmit = async () => {
  const dateTime = new Date(selectedDate.value.concat(selectedTime.value))
  const res = await $client.appointments.schedule.mutate({
    patientId: id as string,
    doctorId: selectedDoctor.value as string,
    dateTime: dateTime as Date
  })
  if (res.id) {
    emit('refreshAppointments')
    alert('appointment has been scheduled')
    isFormModalOpen.value = false
  }
}
</script>

<template>
  <div>
    <UButton label="New Appointment" @click="isFormModalOpen = true" />

    <UModal v-model="isFormModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="font-bold text-lg">
            Schedule Appointment
          </h1>
        </template>

        <div>
          <form class="flex flex-col gap-5">
            <UFormGroup label="Doctor">
              <USelect v-model="selectedDoctor" :options="doctors" placeholder="Search Doctor" value-attribute="id" option-attribute="name" />
            </UFormGroup>
            <UFormGroup label="Date">
              <UInput v-model="selectedDate" type="date" />
              <p v-if="!isDateValid" class="text-red-500">
                Please choose a future date!
              </p>
            </UFormGroup>
            <UFormGroup label="Time">
              <USelect v-model="selectedTime" :options="availableTimes()" placeholder="Select Time" value-attribute="id" option-attribute="name" />
            </UFormGroup>
            <UFormGroup>
              <UButton :disabled="!isDateValid && !!selectedTime" @click="onSubmit">
                Submit
              </UButton>
            </UFormGroup>
          </form>
        </div>

        <template #footer />
      </UCard>
    </UModal>
  </div>
</template>
