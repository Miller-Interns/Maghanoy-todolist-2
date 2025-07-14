<template>
  <main class="app-container">
    <!-- RouterView will display the component based on the current URL -->
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted } from 'vue'

// 1. Get the router instance
const router = useRouter()

// 2. Use the onMounted lifecycle hook
onMounted(() => {

  router.push({ name: 'TRAINEE' })


})
</script>

