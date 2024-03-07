<script lang="ts" setup>
import LoginForm from '~/components/forms/LoginForm.vue'
const { $client } = useNuxtApp()
const ddd = await $client.users.authen.query({ email: '99', password: '99'})
console.log(ddd)
</script>

<template>
  <div class="my-10 bg-white border border-1 border-gray-200 shadow-sm md:w-[70%] m-auto">
    <h1 class="bg-primary p-5 flex items-center text-xl font-bold text-white text-center"> Login</h1>
    <LoginForm />
  </div>
</template>

<style scoped>

</style>
