<template>
  <div class="md:w-[70%] m-auto">
    <AllDoctors :doctors="doctors" />
  </div>
</template>

<script setup lang="ts">
import AllDoctors from '~/components/views/AllDoctors.vue'

const { $client } = useNuxtApp()

const res = await $client.doctors.getAll.useQuery()
const doctors = res.data.value?.map((u) => {
  return {
    ...u.user,
    id: u.id,
    no: res.data.value.indexOf(u) + 1
  }
})


</script>
