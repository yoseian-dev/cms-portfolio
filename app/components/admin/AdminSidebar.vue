<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/admin',
  },
  {
    label: 'Posts',
    icon: 'i-lucide-file-text',
    to: '/admin/posts',
  },
  {
    label: 'Categories',
    icon: 'i-lucide-folder',
    to: '/admin/categories',
  },
]
</script>

<template>
  <aside class="w-64 shrink-0 border-r border-default bg-muted/30 p-4">
    <div class="mb-6 text-lg font-bold">
      CMS Admin
    </div>

    <UNavigationMenu
      :items="items"
      orientation="vertical"
      :ui="{ link: 'p-2' }"
    />
  </aside>
</template>
