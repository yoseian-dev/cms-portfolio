<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"
definePageMeta({
  layout: 'admin'
})

const columns = [
  { accessorKey: 'name', header: '名前' },
  { accessorKey: 'slug', header: 'スラッグ' },
  { accessorKey: 'postCount', header: '記事数' },
  { accessorKey: 'createdAt', header: '作成日' },
  { id: 'actions', header: '操作' }
]

const { data, status, error, refresh } = useLazyFetch('/api/admin/categories', {
  server: false
})

const categories = computed(() => data.value?.categories)

const isCreateModalOpen = ref(false)
const schema = z.object({
  name: z.string().trim().min(1, 'カテゴリー名を入力してください').max(50, 'カテゴリーは50文字以内で入力してください'),
  slug: z.string().trim().min(1, 'スラッグを入力してください').max(50, 'スラッグは50文字以内で入力してください').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'スラッグは半角英数字とハイフンで入力してください'
  )
})
type Schema = z.output<typeof schema>

const form = reactive<Schema>({
  name: '',
  slug: ''
})

function resetForm() {
  form.name = ''
  form.slug = ''
}

function closeCreateModal() {
  isCreateModalOpen.value = false
  resetForm()
}

const toast = useToast()
const isSubmitting = ref(false)
async function createCategory(event: FormSubmitEvent<Schema>) {
  console.log('createCategory...')
  isSubmitting.value = true
  try {
    console.log(event.data)
    const result = await $fetch('/api/admin/categories', {
      method: 'POST',
      body: event.data
    })
    console.log('result: ', result)

    closeCreateModal()
    await refresh()
  } catch (error: any) {
    console.log(error.data)
    toast.add({
      title: 'カテゴリーの作成に失敗しました',
      description: error.data.data.message,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const editPost = (post: Object) => {
  console.log('edit post:', post)
}

const deletePost = (post: Object) => {
  console.log('delete post:', post)
}
</script>

<template>
  <div class="p-6 flex flex-col gap-6 h-full">
    <!-- title -->
    <div class="flex justify-between items-center min-h-0 shrink-0">
      <div class="">
        <h1 class="text-2xl font-bold">カテゴリー管理</h1>
        <p>カテゴリーの作成、編集、削除を行います。</p>
      </div>
      <UButton icon="i-heroicons-plus" @click="() => { isCreateModalOpen = true }">新規作成</UButton>
      <UModal v-model:open="isCreateModalOpen" title="カテゴリーの新規作成">
        <template #body>
          <UForm :schema="schema" :state="form" class="space-y-5" @submit="createCategory">
            <UFormField label="名前" name="name">
              <UInput v-model="form.name" class="w-full" placeholder="カテゴリーを入力" />
            </UFormField>
            <UFormField label="スラッグ" name="slug" help="URLで使用する識別子です">
              <UInput v-model="form.slug" class="w-full" placeholder="例：nuxt" />
            </UFormField>
            <div class="flex justify-end gap-3 pt-4">
              <UButton type="button" variant="outline" color="neutral" @click="closeCreateModal">キャンセル</UButton>
              <UButton type="submit" color="primary" icon="i-lucide-plus" :loading="isSubmitting">作成する</UButton>
            </div>
          </UForm>
        </template>
      </UModal>
    </div>
    <!-- grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 shrink-0">
      <UCard>
        <div class="mb-1">全カテゴリー</div>
        <div class="text-2xl font-bold min-h-[1lh]">{{ data?.stats?.total }}</div>
      </UCard>
      <UCard>
        <div class="mb-1">使用中</div>
        <div class="text-2xl font-bold min-h-[1lh]">{{ data?.stats?.using }}</div>
      </UCard>
      <UCard>
        <div class="mb-1">未使用</div>
        <div class="text-2xl font-bold min-h-[1lh]">{{ data?.stats?.unused }}</div>
      </UCard>
    </div>
    <!-- テーブル -->
    <UCard class="flex flex-col min-h-0 max-h-[calc(100vh-240px)] relative" :ui="{
      body: 'h-full min-h-0 flex flex-col'
    }">
      <!-- loading... -->
      <div v-if="status === 'idle' || status === 'pending'" class="absolute inset-0 z-10 flex items-center justify-center
           bg-white/60 backdrop-blur-[1px]">
        <UIcon name="i-lucide-loader-circle" class="animate-spin size-8" />
      </div>
      <UTable ref="table" :data="categories" :columns="columns" :sticky="true" class="h-full">
        <template #empty>
          <div class="py-12 text-center text-gray-500">
            条件に一致する記事がありません。
          </div>
        </template>
        <template #postCount-cell="{ row }">
          <UBadge :color="row.original.postCount > 0 ? 'success' : 'neutral'" variant="soft">
            {{ row.original.postCount }}
          </UBadge>
        </template>
        <template #createdAt-cell="{ row }">{{ formatDate(row.original.createdAt) }}</template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <UButton size="xs" variant="ghost" color="success" icon="i-heroicons-pencil-square"
              @click="editPost(row.original)" />

            <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash"
              @click="deletePost(row.original)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>