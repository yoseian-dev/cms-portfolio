<script setup lang="ts">

const sidebarOpen = ref(true)
const sidebarCollapsed = ref(false)
const currentYear = new Date().getFullYear()
const version = '0.1.0'

</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <!-- left sidebar -->
    <AdminSidebar v-model:open="sidebarOpen" v-model:collapsed="sidebarCollapsed" />
    <!-- right content -->
    <div class="min-h-0 min-w-0 flex flex-col flex-1">
      <!-- header -->
      <UDashboardNavbar :toggle="false">
        <template #leading>
          <UButton color="neutral" variant="ghost" icon="i-lucide-menu" aria-label="Menu" class="inline-block lg:hidden"
            @click="() => { sidebarOpen = !sidebarOpen }" />
          <UButton color="neutral" variant="ghost" icon="i-lucide-menu" aria-label="Menu" class="hidden lg:inline-block"
            @click="() => { sidebarCollapsed = !sidebarCollapsed }" />
        </template>
        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
      <!-- main -->
      <main class="flex-1 flex flex-col min-h-0 bg-muted">
        <slot />
      </main>
      <!-- footer -->
      <UFooter>
        <template #left>© {{ currentYear }} Yoseian</template>
        <template #right>バージョン {{ version }}</template>
      </UFooter>
    </div>
  </div>
</template>
