<template>
  <div class="md:w-[70%] m-auto">
    <AllPatients :patients="patients"/>
  </div>
</template>

<script setup lang="ts">
import AllPatients from '~/components/AllPatients.vue'

const { $client } = useNuxtApp()

const res = await $client.patients.getAll.useQuery()
const patients = res.data.value?.map((u) => {
  return {
    ...u.user,
    id: u.id,
    allergies: u.allergies,
    no: res.data.value.indexOf(u) + 1
  }
})
</script>
