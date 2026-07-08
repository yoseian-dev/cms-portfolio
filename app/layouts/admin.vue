<script setup lang="ts">

const sidebarOpen = ref(true)
</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <AdminSidebar v-model:open="sidebarOpen" />

    <div class="min-h-0 flex flex-col flex-1">
      <AdminTopbar class="shrink-0" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="p-6 flex-1 min-h-0 bg-gray-100">
        <slot />
      </main>
    </div>
  </div>
</template>
