<script setup lang="ts">

const isFormModalOpen = ref(false)
const isQueModalOpen = ref(false)

const { id } = useRoute().params
const { $client } = useNuxtApp()
const emit = defineEmits(['refreshAppointments'])

async function getDoctors () {
  const doctorRes = await $client.doctors.getAll.useQuery()
  return doctorRes.data.value?.map((d) => {
    return {
      id: d.id,
      name: [d.user.firstName, d.user.middleName, d.user.lastName].join(' ')
    }
  })
}

function getAllTimes () {
  const allTimes = []
  for (let i = 8; i < 17; i++) {
    const t = `${(i < 10 ? '0' : '') + i}:00`
    allTimes.push({ id: 'T' + t, name: t })
  }
  return allTimes
}

async function getDoctorAvailableTimes () {
  if (selectedDate.value && selectedDoctor.value) {
    const timesDoctorNotAvailable = await $client.appointments.doctorScheduleAtDate.query({ doctorId: selectedDoctor.value as string, dateTime: new Date(selectedDate.value) })
    return getAllTimes().filter(t => (!timesDoctorNotAvailable.find(tNot => !!tNot.includes(t.name))))
  }
  return []
}
const doctors = await getDoctors()
const selectedDoctor = ref<any>(undefined)

const selectedDate = ref<any>(null)
const isDateValid = computed(() => !(new Date(selectedDate.value) < new Date()))

const doctorAvailableTimes = ref(await getDoctorAvailableTimes())
const selectedTime = ref<any |null>(undefined)

watch(selectedDoctor, async () => {
  doctorAvailableTimes.value = await getDoctorAvailableTimes()
})
watch(selectedDate, async () => {
  doctorAvailableTimes.value = await getDoctorAvailableTimes()
})

const submitDisabled = computed(() => !(!!selectedTime.value && !!selectedDoctor.value && isDateValid.value))
const onSubmit = async () => {
  const dateTime = new Date(selectedDate.value.concat(selectedTime.value))
  const res = await $client.appointments.schedule.mutate({
    patientId: id as string,
    doctorId: selectedDoctor.value as string,
    dateTime: dateTime as Date
  })
  console.log(res)

  if (res) {
    emit('refreshAppointments')
    alert('appointment has been scheduled')
    isFormModalOpen.value = false
    selectedDoctor.value = null
    selectedTime.value = null
    selectedDate.value = null
    const smsRes = await $client.sms.send.query({ text: `you have scheduled an appointment with a doctor on ${res.dateTime}` })
    console.log(smsRes)
  }
}

const userStore = useUserStore()
const queTime = await $client.que.patient.query({ patientId: id as string })
// const que = await $client.que.patient.query({ patientId: id as string })
</script>

<template>
  <div>
    <UButton label="New Appointment" class="ml-5 border border-2 border-primary bg-white text-primary hover:bg-green-100" @click="isFormModalOpen = true" />
    <UButton v-if="userStore.user?.role === 'patient'" label="Que" class="ml-5 border border-2 border-primary bg-white text-primary hover:bg-green-100" @click="isQueModalOpen = true" />

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
              <USelect v-model="selectedTime" :options="doctorAvailableTimes" placeholder="Select Time" value-attribute="id" option-attribute="name" />
            </UFormGroup>
            <UFormGroup>
              <UButton :disabled="submitDisabled" @click="onSubmit">
                Submit
              </UButton>
            </UFormGroup>
          </form>
        </div>

        <template #footer />
      </UCard>
    </UModal>

    <UModal v-model="isQueModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="font-bold text-lg text-center">
            Wait Time on Que list
          </h1>
        </template>
        <div>
          <h1 v-if="queTime" class="text-[48px] text-center">
            {{ calcWaitTime(queTime.dateTime) }}
          </h1>
          <h1 v-else class="text-center">
            You Are not on the Que List!.
          </h1>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
