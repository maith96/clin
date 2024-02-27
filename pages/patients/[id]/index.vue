<script setup lang="ts">
import UserDetails from '~/components/views/userDetails.vue'
import Appointments from '~/components/views/Appointments.vue'
import Reports from '~/components/views/Reports.vue'
import {onlyDateTime} from "~/utils/formatTime";

const { $client } = useNuxtApp()
const { id } = useRoute().params

const res = await $client.patients.get.useQuery({ id: id as string })
const patientData = res.data.value
const user = patientData?.user
const reports = ref<any>(await getReports())

const { data, refresh } = await useAsyncData(async () => await $client.appointments.patient.query({ patientId: id as string }))
const appointments = computed(() => {
  return data.value?.map((d) => {
    if (data.value) {
      return { ...d, no: (data.value.indexOf(d) + 1), dateTime: onlyDateTime(d.dateTime) }
    }
    return []
  })
})

async function getReports () {
  const data = await $client.reports.patient.query({ patientId: id as string })
  return data?.map((d) => {
    return { ...d, no: data?.indexOf(d) + 1, dateTime: onlyDateTime(d.dateTime) }
  }) ?? []
}

</script>

<template>
  <div>
    <div class="flex  gap-5  md:w-[70%] m-auto ">
      <Appointments access="patient" :appointments="appointments" @refresh-appointments="refresh()"/>
      <UserDetails :user-data="user" class="flex-2 min-w-[400px]" />
    </div>
    <Reports :reports="reports"/>
  </div>
</template>

<style scoped>

</style>
