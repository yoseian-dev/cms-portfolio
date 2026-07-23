<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"
definePageMeta({
  layout: 'admin'
})

type Category = {
  id: string,
  name: string,
  slug: string,
  postCount: number,
  createdAt: string,
  updatedAt: string
}

type CategoriesResponse = {
  stats: {
    total: number,
    using: number,
    unused: number
  },
  categories: Category[]
}

const columns = [
  { accessorKey: 'name', header: '名前' },
  { accessorKey: 'slug', header: 'スラッグ' },
  { accessorKey: 'postCount', header: '記事数' },
  { accessorKey: 'createdAt', header: '作成日' },
  { id: 'actions', header: '操作' }
]

const { $api } = useNuxtApp()
const { data, status, error, refresh } = useLazyFetch<CategoriesResponse>('/api/admin/categories', {
  server: false,
  $fetch: $api
})

const categories = computed(() => data.value?.categories)

const schema = z.object({
  id: z.string().nullable(),
  name: z.string().trim().min(1, 'カテゴリー名を入力してください').max(50, 'カテゴリーは50文字以内で入力してください'),
  slug: z.string().trim().min(1, 'スラッグを入力してください').max(50, 'スラッグは50文字以内で入力してください').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'スラッグは半角英数字とハイフンで入力してください'
  )
})
type Schema = z.output<typeof schema>

const form = reactive<Schema>({
  id: null,
  name: '',
  slug: ''
})

function resetForm() {
  form.id = null
  form.name = ''
  form.slug = ''
}

const isModalOpen = ref(false)
function closeModal() {
  isModalOpen.value = false
  setTimeout(resetForm, 200)
}
const isEditing = computed(() => Boolean(form.id))

const toast = useToast()
const isSubmitting = ref(false)
async function submitCategory(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await editCategorySubmit(event)
    } else {
      await createCategorySubmit(event)
    }
    closeModal()
    await refresh()
  } catch (error: any) {
    toast.add({
      title: isEditing.value ? 'カテゴリーの編集に失敗しました' : 'カテゴリーの作成に失敗しました',
      description: error.data.data.message,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
async function createCategorySubmit(event: FormSubmitEvent<Schema>) {

  await $api('/api/admin/categories', {
    method: 'POST',
    body: event.data
  })
}
async function editCategorySubmit(event: FormSubmitEvent<Schema>) {

  if (!event.data.id) {
    throw new Error('カテゴリーIDがありません')
  }
  await $api(`/api/admin/categories/${event.data.id}`, {
    method: 'PATCH',
    body: {
      name: event.data.name,
      slug: event.data.slug
    }
  })
}

const editCategory = (category: Category) => {
  form.id = category.id
  form.name = category.name
  form.slug = category.slug
  isModalOpen.value = true
}

const selectedCategory = ref<Category | null>(null)
const isDeleting = ref(false)
const deleteModalOpen = ref(false)
const deleteCategory = (category: Category) => {
  selectedCategory.value = category
  deleteModalOpen.value = true
}
function closeDeletModal() {
  deleteModalOpen.value = false
  selectedCategory.value = null
}
async function confirmDelete() {
  try {
    isDeleting.value = true
    await $api(`/api/admin/categories/${selectedCategory.value?.id}`, {
      method: "delete"
    })
    void refresh()
    deleteModalOpen.value = false
  } catch (error: any) {
    toast.add({
      title: "カテゴリーの削除に失敗しました",
      description: error.data?.data?.message ?? "予期しないエラーが発生しました",
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
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
      <UButton icon="i-heroicons-plus" @click="() => { isModalOpen = true }">新規作成</UButton>
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
              @click="editCategory(row.original)" />

            <UTooltip :text="row.original.postCount > 0 ? '記事は登録されているカテゴリーは削除できません' : 'カテゴリーを削除'">
              <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash"
                @click="deleteCategory(row.original)" :disabled="row.original.postCount > 0" />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>
    <!-- モーダル -->
    <UModal v-model:open="isModalOpen" :title="isEditing ? 'カテゴリーの編集' : 'カテゴリーの新規作成'">
      <template #body>
        <UForm :schema="schema" :state="form" class="space-y-5" @submit="submitCategory">
          <UFormField label="名前" name="name">
            <UInput v-model="form.name" class="w-full" placeholder="カテゴリーを入力" />
          </UFormField>
          <UFormField label="スラッグ" name="slug" help="URLで使用する識別子です">
            <UInput v-model="form.slug" class="w-full" placeholder="例：nuxt" />
          </UFormField>
          <div class="flex justify-end gap-3 pt-4">
            <UButton type="button" variant="outline" color="neutral" @click="closeModal">キャンセル</UButton>
            <UButton type="submit" color="primary" icon="i-lucide-plus" :loading="isSubmitting">
              {{ isEditing ? '保存する' : '作成する' }}
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="deleteModalOpen" title="カテゴリーを削除しますか">
      <template #body>
        <p class="text-sm text-muted mt-2">
          「{{ selectedCategory?.name }}」を削除します。この操作は取り消せません。
        </p>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="closeDeletModal">キャンセル</UButton>
          <UButton color="error" @click="confirmDelete" :loading="isDeleting">削除する</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>