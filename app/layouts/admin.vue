<template>
  <div class="min-h-screen flex">
    <AdminSidebar v-model:open="sidebarOpen" />

    <div class="flex-1">
      <AdminTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

const sidebarOpen = ref(true)
</script>
