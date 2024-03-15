import { defineStore } from 'pinia'

interface TUser {
  names: string
  id: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<TUser | null>(null)

  function signIn (lUser:TUser) {
    user.value = lUser
  }
  function signOut () {
    user.value = null
  }
  return { user, signIn, signOut }
})
