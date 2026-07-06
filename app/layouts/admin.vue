<template>
  <div class="min-h-screen flex">
    <AdminSidebar />

    <div class="flex-1">
      <AdminTopbar />

      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
