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
    icon: 'i-heroicons-document-text',
    to: '/admin/posts',
  },
  {
    label: 'Categories',
    icon: 'i-heroicons-folder',
    to: '/admin/categories',
  },
]

const open = defineModel<boolean>('open', { default: true })

</script>

<template>
  <USidebar collapsible="icon" v-model:open="open" :ui="{
    container: 'h-full',
    inner: 'bg-elevated/25 divide-transparent',
    body: 'py-0'
  }">
    <template #header="{ state }">
      <div v-if="state === 'expanded'" class="text-lg font-bold whitespace-nowrap">
        CMS Admin
      </div>
      <div v-else class="flex justify-center">
        <UIcon name="i-lucide-layout-dashboard" class="size-6" />
      </div>
    </template>

    <template #default="{ state }">
      <UNavigationMenu :items="items" orientation="vertical" :ui="{ link: 'p-3 overflow-hidden' }" />
    </template>
  </USidebar>
</template>
