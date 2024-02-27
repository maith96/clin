<script setup lang="ts">
import { defineProps } from 'vue'

const prop = defineProps({
  userData: Object
})

</script>

<template>
  <div
    class="my-5 bg-white border border-1 border-gray-100
       shadow-sm flex-2"
  >
    <h1 class="bg-orange-400 p-5 flex items-center text-lg">
      <UIcon name="i-heroicons-user-20-solid" class="mr-3" /> Patient Details
    </h1>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Names: </b>
      <span  class="flex-1">{{ prop.userData.firstName }} {{ prop.userData.middleName }} {{ prop.userData.lastName }}</span>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Age: </b>
      <span  class="flex-1">{{ prop.userData.age }}</span>
    </div>

    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Height: </b>
      <p  class="flex-1">{{ prop.userData.height }}</p>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Weight: </b>
      <p class="flex-1">{{ prop.userData.weight }}</p>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Email: </b>
      <p class="flex-1">{{ prop.userData.email }}</p>
    </div>

    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Contact Number: </b>
      <p class="flex-1">+254{{ prop.userData.contactNumber }}</p>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Address: </b>
      <p class="flex-1">{{ prop.userData.address }}</p>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Allergies: </b>
      <div class="flex-1">
        <p>Meat</p>
        <p>Dairy</p>
        <p>Pets</p>
      </div>
    </div>
    <div class="px-5 py-2 flex justify-between bg-gray-100 m-3">
      <b class="flex-1">Date Registered: </b>
      <p class="flex-1">{{ prop.userData.createdAt }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>
