<script setup lang="ts">
const { session } = await useSession()
const userStore = useUserStore()

const items = [
  [{
    label: 'Sign Out',
    click: () => {
      userStore.signOut()
      return navigateTo('/')
    }
  }]
]

if (!(session.value?.user) && !(useRoute().fullPath === '/')) {
  navigateTo('/')
} else {
  userStore.signIn(session.value?.user)
}
const bg = computed(() => {
  if (userStore.user?.role === 'patient') { return 'cyan-300' }
  if (userStore.user?.role === 'doctor') { return 'cyan-300' }
  if (userStore.user?.role === 'receptionist') { return 'pink-300' }
})

</script>

<template>
  <div>
    <div class="p-10 bg-gray-700 text-center h-[10vh]">
      <div class="flex justify-between w-[70%] m-auto">
        <div class="flex align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-primary text-[32px]" width="1em" height="1em" viewBox="0 0 64 64"><path fill="currentColor" d="M5.482 33.956h5.547c.421 0 .811.21 1.043.556c0 0 1.057 1.596 2.112 3.179c.585-5.186 2.622-23.314 2.622-23.314c.07-.598.561-1.07 1.171-1.105a1.245 1.245 0 0 1 1.287.956s2.656 11.137 3.913 16.399l1.663-4.708a1.248 1.248 0 0 1 2.35-.014s2.467 6.701 2.961 8.051h4.814c.421 0 .811.21 1.042.556c0 0 1.058 1.596 2.111 3.18c.587-5.186 2.624-23.314 2.624-23.314a1.25 1.25 0 0 1 2.458-.149l3.911 16.399l1.666-4.708a1.247 1.247 0 0 1 2.348-.014s2.47 6.701 2.963 8.051h4.92l.262-.5c2.39-4.112 4.135-11.726 4.135-17.271c0-7.075-5.149-15.621-15.183-15.621c-14.338 0-16.181 13.431-16.181 13.431S30.263.63 15.934.63C6.254.63 1.061 8.866 1.061 16.186c0 6.322 2.768 14.126 4.186 17.331z" /><path fill="currentColor" d="M53.216 36.456c-.526 0-.993-.329-1.172-.818l-2.068-5.617l-1.915 5.432c-.185.523-.69.862-1.243.829a1.238 1.238 0 0 1-1.149-.958l-3.238-13.567l-2.208 19.623a1.247 1.247 0 0 1-.951 1.072a1.248 1.248 0 0 1-1.334-.521s-3.03-4.561-3.642-5.476H29.28a1.25 1.25 0 0 1-1.171-.818l-2.068-5.616a4924.56 4924.56 0 0 0-1.92 5.432a1.24 1.24 0 0 1-1.243.829a1.248 1.248 0 0 1-1.153-.958l-3.232-13.558l-2.207 19.614a1.248 1.248 0 0 1-.95 1.072a1.25 1.25 0 0 1-1.335-.521s-3.03-4.561-3.642-5.476H6.84c8.964 15.927 25.201 26.417 25.201 26.417S48.572 52.38 57.679 36.455h-4.462z" /></svg>
          <NuxtLink to="/" class="mr-10 text-pretty text-gray-200  font-bold text-xl ml-3">
            Clinic Management System
          </NuxtLink>
        </div>
        <div>
          <UDropdown v-if="userStore?.user" mode="hover" :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" class="bg-gray-700 hover:bg-gray-800">
              {{ userStore?.user.names }}
            </UButton>
          </UDropdown>
          <NuxtLink v-if="!userStore?.user" to="/" class="mr-10 text-pretty text-gray-200  font-bold text-xl ml-3">
            Login
          </NuxtLink>
        </div>
      </div>
    </div>
    <h1 v-if="userStore.user?.role === 'patient'" class="font-bold text-xl text-center p-5 bg-blue-300">
      Patient
    </h1>
    <h1 v-if="userStore.user?.role === 'doctor'" class="font-bold text-xl text-center p-5 bg-purple-300">
      Doctor
    </h1>
    <h1 v-if="userStore.user?.role === 'receptionist'" class="font-bold text-xl text-center p-5 bg-yellow-300">
      Receptionist
    </h1>
  </div>
</template>

<style scoped>

</style>
