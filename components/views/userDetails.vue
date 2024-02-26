<script setup lang="ts" >
import { defineProps } from 'vue';

const prop = defineProps({
  userData: Object
})

</script>

<template>
      <div class="my-5 bg-white border border-1 border-gray-100
       shadow-sm flex-2">
        <h1 class="bg-orange-400 p-5 flex items-center text-lg"><UIcon name="i-heroicons-user-20-solid" class="mr-3"/> Patient Details</h1>
        <div class="px-5 py-2">
          <b>Names: </b>
          <span>{{prop.userData.firstName}} {{prop.userData.middleName}} {{prop.userData.lastName}}</span>
        </div>
        <div class="px-5 py-2">
          <b>Age: </b>
          <p>{{prop.userData.age}}</p>
        </div>

        <div class="px-5 py-2">
          <b>Height: </b>
          <p>{{prop.userData.height}}</p>
        </div>
        <div class="px-5 py-2">
          <b>Weight: </b>
          <p>{{prop.userData.weight}}</p>
        </div>
        <div class="px-5 py-2">
          <b>Email: </b>
          <p>{{prop.userData.email}}</p>
        </div>

        <div class="px-5 py-2">
          <b>Contact Number: </b>
          <p>+254{{prop.userData.contactNumber}}</p>
        </div>
        <div class="px-5 py-2">
          <b>Address: </b>
          <p>{{prop.userData.address}}</p>
        </div>
      </div>

</template>

<style scoped>

</style>
