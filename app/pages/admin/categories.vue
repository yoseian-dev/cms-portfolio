<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"
import { getApiErrorMessage } from "~/utils/api-error"

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
const { data, status, refresh } = useLazyFetch<CategoriesResponse>('/api/admin/categories', {
  server: false,
  $fetch: $api
})

const stats = computed(() => [
  {
    label: '全カテゴリー',
    value: data.value?.stats?.total || 0,
    icon: 'i-heroicons-folder-open',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    iconBgClass: 'bg-emerald-50 dark:bg-emerald-950/50'
  }, {
    label: '使用中',
    value: data.value?.stats?.using || 0,
    icon: 'i-heroicons-check-circle',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    iconBgClass: 'bg-emerald-50 dark:bg-emerald-950/50'
  }, {
    label: '未使用',
    value: data.value?.stats?.unused || 0,
    icon: 'i-heroicons-x-circle',
    iconClass: 'text-gray-600 dark:text-gray-400',
    iconBgClass: 'bg-gray-50 dark:bg-gray-950/50'
  }
]
)
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
  } catch (error: unknown) {
    toast.add({
      title: isEditing.value ? 'カテゴリーの編集に失敗しました' : 'カテゴリーの作成に失敗しました',
      description: getApiErrorMessage(error),
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
function closeDeleteModal() {
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
  } catch (error: unknown) {
    toast.add({
      title: "カテゴリーの削除に失敗しました",
      description: getApiErrorMessage(error),
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

</script>

<template>
  <div class="p-6 space-y-6 min-h-full overflow-y-auto">
    <!-- title -->
    <div class="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center min-h-0 shrink-0">
      <div>
        <h1 class="text-2xl font-bold">カテゴリー管理</h1>
        <p class="text-muted">カテゴリーの作成、編集、削除を行います。</p>
      </div>
      <UButton icon="i-heroicons-plus" @click="() => { isModalOpen = true }">新規作成</UButton>
    </div>
    <!-- grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 shrink-0">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-full" :class="stat.iconBgClass">
            <UIcon :name="stat.icon" class="size-6" :class="stat.iconClass" />
          </div>
          <div>
            <div class="mb-1">{{ stat.label }}</div>
            <div class="text-2xl font-bold min-h-[1lh]">{{ stat.value }}</div>
          </div>
        </div>
      </UCard>
    </div>
    <!-- テーブル -->
    <UCard class="flex flex-col min-h-0 max-h-[calc(100vh-240px)] relative" :ui="{
      body: 'h-full min-h-0 flex flex-col'
    }">
      <!-- loading... -->
      <div v-if="status === 'idle' || status === 'pending'" class="absolute inset-0 z-10 flex items-center justify-center
           bg-muted/60 backdrop-blur-[1px]">
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

            <UTooltip :text="row.original.postCount > 0 ? '記事が登録されているカテゴリーは削除できません' : 'カテゴリーを削除'">
              <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash"
                :disabled="row.original.postCount > 0" @click="deleteCategory(row.original)" />
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
        <p class="text-sm text-muted mb-4">
          「{{ selectedCategory?.name }}」を削除します。この操作は取り消せません。
        </p>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="closeDeleteModal">キャンセル</UButton>
          <UButton color="error" :loading="isDeleting" @click="confirmDelete">削除する</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>