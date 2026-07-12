<script setup lang="ts">

const sidebarOpen = ref(true)

const currentYear = new Date().getFullYear()

const version = '0.1.0'

</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <AdminSidebar v-model:open="sidebarOpen" />

    <div class="min-h-0 flex flex-col flex-1">

      <!-- header -->
      <AdminTopbar class="shrink-0" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- main -->
      <main class="flex-1 min-h-0 bg-gray-100">
        <slot />
      </main>

      <!-- footer -->
      <footer class="flex justify-between items-center shrink-0 py-4 px-6 border-t border-default bg-default text-sm text-muted relative">
        <p>
          © {{ currentYear }} Yoseian
        </p>
        <p>
          バージョン {{ version }}
        </p>
      </footer>
    </div>

  </div>
</template>
