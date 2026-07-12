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
const categoryId = ref('all')
const postStatus = ref<PostStatus | 'all'>('all')

let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(keyword, (value) => {
  clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    debouncedKeyword.value = value.trim()
  }, 300)
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
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
const posts = computed(() =>
  data.value.posts.map(post => ({
    id: post.id,
    title: post.title,
    category: post.category?.name ?? '未分類',
    status: post.status === 'PUBLISHED' ? '公開中' : '下書き',
    createdAt: formatDate(post.createdAt)
  }))
)

const stats = computed(() => data.value.stats)

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
    .format(new Date(value))
    .replaceAll('/', '-')
}

const columns = [
  {
    accessorKey: 'title',
    header: 'タイトル'
  },
  {
    accessorKey: 'category',
    header: 'カテゴリ'
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

const editPost = (post: Object) => {
  console.log('edit post:', post)
}

const deletePost = (post: Object) => {
  console.log('delete post:', post)
}
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
      <UButton icon="i-heroicons-plus">新規作成 </UButton>
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
          <USelect v-model="categoryId" :items="categoryItems" class="min-w-40" />
          <USelect v-model="postStatus" :items="statusItems" class="min-w-40" />
        </div>
      </div>
      <div class="relative h-full">
        <!-- loading... -->
        <div v-if="status === 'idle' || status === 'pending'" class="absolute inset-0 z-10 flex items-center justify-center
           bg-white/60 backdrop-blur-[1px]">
          <UIcon name="i-lucide-loader-circle" class="animate-spin size-8" />
        </div>
        <!-- table -->
        <UTable ref="table" :data="posts" :columns="columns" :sticky="true" class="h-full">
          <template #empty>
            <div class="py-12 text-center text-gray-500">
              条件に一致する記事がありません。
            </div>
          </template>
          <template #status-cell="{ row }">
            <UBadge :color="row.original.status === '公開中' ? 'success' : 'neutral'" variant="soft">
              {{ row.original.status }}
            </UBadge>
          </template>
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton size="xs" variant="ghost" color="success" icon="i-heroicons-pencil-square"
                @click="editPost(row.original)" />

              <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash"
                @click="deletePost(row.original)" />
            </div>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>