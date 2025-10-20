<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  username: {
    type: String,
    default: 'User',
  },
})

const currentTime = ref('')

onMounted(() => {
  const date = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  currentTime.value = date.toLocaleDateString('en-EN', options)
})
</script>

<template>
  <section class="greeting-section p-1 mb-4">
    <h4 class="fw-semibold mb-1">Hi {{ username }}, Good Morning</h4>
    <p class="text-muted m-0">{{ currentTime }}</p>
  </section>
</template>

<style scoped>
.greeting-section {
  transition: all 0.3s ease;
}
</style>
