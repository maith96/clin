<script setup lang="ts">
import UserDetails from '~/components/views/userDetails.vue'
import Appointments from '~/components/views/Appointments.vue'
import Reports from '~/components/views/Reports.vue'

const { $client } = useNuxtApp()
const { id } = useRoute().params

const res = await $client.patients.get.useQuery({ id: id as string })
const patientData = res.data.value
const user = patientData?.user
const reports = ref<any>(await getReports())

const { data, refresh } = await useAsyncData(async () => await $client.appointments.patient.query({ patientId: id as string }))
async function getReports () {
  const data = await $client.reports.patient.query({ patientId: id as string })
  return (data ?? [])
}

</script>

<template>
  <div class="flex  gap-5  md:w-[70%] m-auto ">
    <Appointments access="patient" :appointments="data" @refresh-appointments="refresh()"/>
    <UserDetails :user-data="user" class="flex-2" />
  </div>
  <Reports :reports="reports"/>
</template>

<style scoped>

</style>
