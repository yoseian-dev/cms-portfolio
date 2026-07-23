<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'ダッシュボード',
    icon: 'i-heroicons-home',
    to: '/admin',
  },
  {
    label: '記事管理',
    icon: 'i-heroicons-document-text',
    to: '/admin/posts',
  },
  {
    label: 'カテゴリー管理',
    icon: 'i-heroicons-folder',
    to: '/admin/categories',
  },
]

const open = defineModel<boolean>('open', { default: true })

const toast = useToast()
const { user, clear } = useUserSession()
const isLoggingOut = ref(false)
async function onLogout() {
  try {
    isLoggingOut.value = true
    await clear()
    await navigateTo("/login")
  } catch {
    toast.add({
      title: 'ログアウトに失敗しました',
      description: '時間をおいて、もう一度お試しください。',
      color: 'error'
    })
  } finally {
    isLoggingOut.value = false
  }
}

</script>

<template>
  <USidebar collapsible="icon" v-model:open="open" :ui="{
    container: 'h-full',
    inner: 'bg-elevated/25 divide-transparent',
    body: 'py-0'
  }">
    <template #header="{ state }">
      <div v-if="state === 'expanded'" class="text-lg font-bold whitespace-nowrap">
        Yoseian CMS
      </div>
      <div v-else class="flex justify-center">
        <UIcon name="i-lucide-layout-dashboard" class="size-6" />
      </div>
    </template>

    <template #default="{ state }">
      <UNavigationMenu :items="items" :collapsed="state === 'collapsed'" orientation="vertical" :ui="{ link: 'py-3' }" />
    </template>
    <template #footer="{ state }">
      <div class="w-full border-t border-default pt-3 space-y-2">
        <UUser v-if="user && state === 'expanded'" :name="user.name || '管理者'" :description="user.email" :avatar="{
          icon: 'i-heroicons-user-solid'
        }" />
        <UButton class="justify-start" :label="state === 'expanded' ? 'ログアウト' : undefined" icon="i-lucide-log-out"
          color="error" variant="ghost" block size="xl" @click="onLogout" :loading="isLoggingOut" />
      </div>
    </template>
  </USidebar>
</template>
