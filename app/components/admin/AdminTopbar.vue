<script setup lang="ts">
const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const sidebarToggle = () => {
  emit('toggle-sidebar')
}
</script>

<template>
  <header class="h-14 border-b border-default px-6 flex items-center justify-between">
    <UButton color="neutral" variant="ghost" icon="i-lucide-menu" aria-label="Menu" @click="sidebarToggle" />

    <div>
      <UButton color="neutral" variant="ghost" icon="i-heroicons-magnifying-glass" aria-label="Search" />
      <UButton color="neutral" variant="ghost" icon="i-heroicons-bell-alert" aria-label="Notifications" />
      <UButton color="neutral" variant="ghost" icon="i-heroicons-sun" aria-label="Model Switch" />
    </div>
  </header>
</template>
