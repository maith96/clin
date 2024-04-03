<script setup lang="ts">

import QueList from '~/components/QueList.vue'

const { $client } = useNuxtApp()

const patientsRes = await $client.patients.getAll.useQuery()

const patientData = (patientsRes.data.value ?? [])

const patients = patientData.map((u) => {
  return {
    ...u.user,
    id: u.id,
    allergies: u.allergies,
    no: patientData.indexOf(u) + 1
  }
})

async function cancelAppointment (id: string) {
  const canceledAppointment = await $client.appointments.cancel.mutate({ id })
  if (canceledAppointment.id) {
    refresh()
  } else {
    alert('failed to delete appointment')
  }
}

const { data: appointments, refresh } = useAsyncData('appointments', async () => {
  const appointmentsRes = await $client.appointments.getAll.query()
  return appointmentsRes.map((a) => {
    return { ...a, dateTime: calcWaitTime(a.dateTime), no: appointmentsRes.indexOf(a) + 1 }
  })
})

async function onFileChange (e: any) {
  const formData = new FormData()
  const file = e.target.files[0]
  formData.append('file', file)
  formData.append('language', 'eng')
  formData.append('apikey', 'K84398234288957')
  formData.append('isOverlayRequired', true)
  const res = await $fetch('https://api.ocr.space/parse/image', {
    method: 'post',
    body: formData,
    headers: {
      'Content-Type': false // adjust content type as per your data

    }

  })
  console.log(res)
}
</script>

<template>
  <div class="md:w-[70%] m-auto">
    <input id="" type="file" name="" @change="onFileChange">
    <!-- <div class="flex justify-center">
    <ULink to="/receptionist/que-list">Que List</ULink>
  </div> -->
    <div class="flex gap-5">
      <QueList @cancel-appointment="cancelAppointment" />
    </div>
    <AllPatients :patients="patients" />
  </div>
</template>

<style scoped>

</style>
