<script setup lang="ts">
import img from '../assets/image.png'

</script>

<template>
  <div class="min-h-[100vh] bg-gray-200">
    <Navbar class="sticky" />
    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bg-image-container {
  /* Set background image URL */
  background-image: url('../assets/image.png');
  /* Set background size to cover */
  background-size: cover;
  /* Set background position to center */
  background-position: center;
  /* Set background repeat to no-repeat */
  background-repeat: no-repeat;
}
</style>
