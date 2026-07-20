<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})

type PostStatus = 'DRAFT' | 'PUBLISHED'

type PostResponse = {
  id: string
  title: string
  slug: string
  status: PostStatus
  createdAt: string
  category: {
    slug: string
    name: string
  } | null
}
type CategoryResponse = {
  id: string
  name: string
}
type PostsPageResponse = {
  stats: {
    total: number
    published: number
    draft: number
    uncategorized: number
  }
  posts: PostResponse[],
  categories: CategoryResponse[]
}
const keyword = ref('')
const debouncedKeyword = ref('')
const categoryId = ref('')
const postStatus = ref('')

let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(keyword, (value) => {
  clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    debouncedKeyword.value = value.trim()
  }, 300)
})

const requestQuery = computed(() => ({
  keyword: debouncedKeyword.value || undefined,
  categoryId:
    categoryId.value === 'all'
      ? undefined
      : categoryId.value,
  status:
    postStatus.value === 'all'
      ? undefined
      : postStatus.value
}))

const { data, status, error, refresh } = await useLazyFetch<PostsPageResponse>('/api/admin/posts', {
  server: false,
  query: requestQuery,
  default: () => ({
    stats: {
      total: 0,
      published: 0,
      draft: 0,
      uncategorized: 0
    },
    posts: [],
    categories: []
  })
})


const categoryItems = computed(() => [
  {
    label: 'すべて',
    value: 'all'
  },
  ...data.value?.categories.map(category => ({
    label: category.name,
    value: category.id
  })),
  {
    label: '未分類',
    value: 'uncategorized'
  }
])

const statusItems = [
  {
    label: 'すべて',
    value: 'all'
  },
  {
    label: '公開中',
    value: 'PUBLISHED'
  },
  {
    label: '下書き',
    value: 'DRAFT'
  }
]

const stats = computed(() => data.value.stats)

const columns = [
  {
    accessorKey: 'title',
    header: 'タイトル'
  },
  {
    accessorKey: 'category',
    header: 'カテゴリー'
  },
  {
    accessorKey: 'status',
    header: 'ステータス'
  },
  {
    accessorKey: 'createdAt',
    header: '作成日'
  },
  {
    id: 'actions',
    header: '操作'
  }
]

const editPost = (post: PostResponse) => {
  navigateTo(`/admin/posts/${post.id}/edit`)
}

const openDeleteModal = ref(false)
const selectedPost = ref<PostResponse | null>(null)
function onDeleteCancel() {
  openDeleteModal.value = false
  selectedPost.value = null
}
const onDeletePost = (post: PostResponse) => {
  selectedPost.value = post
  openDeleteModal.value = true

}

const toast = useToast()
const isDeleting = ref(false)
async function confirmDelete() {
  if (!selectedPost.value) {
    return
  }
  isDeleting.value = true
  try {
    await $fetch(`/api/admin/posts/${selectedPost.value?.id}`, { method: "DELETE" })
    void refresh()
  } catch (error: any) {
    console.log(error.data)
    toast.add({
      title: "記事の削除に失敗しました",
      description: error.data?.data?.message ?? "予期しないエラーが発生しました",
      color: 'error'
    })
  } finally {
    isDeleting.value = false
    openDeleteModal.value = false
  }
}
onBeforeUnmount(() => {
  clearTimeout(searchTimer)
})
</script>

<template>
  <div class="p-6 flex flex-col gap-6 min-h-0 h-full">
    <!-- title -->
    <div class="flex justify-between items-center shrink-0">
      <div>
        <h1 class="text-2xl font-bold">
          記事管理
        </h1>
        <p class="text-gray-500">
          記事の作成、編集、公開状態の管理を行います。
        </p>
      </div>
      <UButton icon="i-heroicons-plus" to="/admin/posts/new">新規作成 </UButton>
    </div>
    <!-- grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
      <UCard>
        <div class="mb-1">全記事</div>
        <div class="text-2xl font-bold">{{ stats.total }}</div>
      </UCard>
      <UCard>
        <div class="mb-1">公開中</div>
        <div class="text-2xl font-bold">{{ stats.published }}</div>
      </UCard>
      <UCard>
        <div class="mb-1">下書き</div>
        <div class="text-2xl font-bold">{{ stats.draft }}</div>
      </UCard>
    </div>
    <!-- table card -->
    <UCard class="flex-1 min-h-0" :ui="{
      body: 'h-full min-h-0 flex flex-col'
    }">
      <div class="flex justify-between min-h-0 items-center mb-4 shrink-0">
        <UInput v-model="keyword" placeholder="記事を検索..." leading-icon="i-heroicons-magnifying-glass">
          <template #trailing>
            <UButton v-if="keyword" color="neutral" variant="link" size="xs" icon="i-heroicons-x-mark"
              aria-label="検索キーワードをクリア" @click="() => { keyword = '' }" />
          </template>
        </UInput>
        <div class="flex gap-3">
          <USelect v-model="categoryId" :items="categoryItems" placeholder="カテゴリーで絞り込み" class="min-w-40" />
          <USelect v-model="postStatus" :items="statusItems" placeholder="ステータスで絞り込み" class="min-w-40" />
        </div>
      </div>
      <div class="relative h-full">
        <!-- loading... -->
        <div v-if="status === 'idle' || status === 'pending'" class="absolute inset-0 z-10 flex items-center justify-center
           bg-white/60 backdrop-blur-[1px]">
          <UIcon name="i-lucide-loader-circle" class="animate-spin size-8" />
        </div>
        <!-- table -->
        <UTable ref="table" :data="data.posts" :columns="columns" :sticky="true" class="h-full">
          <template #empty>
            <div class="py-12 text-center text-gray-500">
              条件に一致する記事がありません。
            </div>
          </template>
          <template #status-cell="{ row }">
            <UBadge :color="row.original.status === 'PUBLISHED' ? 'success' : 'neutral'" variant="soft">
              {{ row.original.status === 'PUBLISHED' ? '公開中' : '下書き' }}
            </UBadge>
          </template>
          <template #category-cell="{ row }">
            {{ row.original.category?.name }}
          </template>
          <template #createdAt-cell="{ row }">
            {{ formatDate(row.original.createdAt) }}
          </template>
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton size="xs" variant="ghost" color="success" icon="i-heroicons-pencil-square"
                @click="editPost(row.original)" />

              <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash"
                @click="onDeletePost(row.original)" />
            </div>
          </template>
        </UTable>
      </div>
    </UCard>
    <!-- delete modal -->
    <UModal v-model:open="openDeleteModal" title="記事を削除しますか">
      <template #body>
        <p>{{ selectedPost?.title }}を削除します。この操作はとりけしません。</p>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="onDeleteCancel">キャンセル</UButton>
          <UButton color="error" @click="confirmDelete" :loading="isDeleting">削除する</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>