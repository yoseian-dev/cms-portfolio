<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})

const posts = ref([
  {
    id: 1,
    title: 'Nuxt 4 と Prisma で CMS を作る',
    category: 'Nuxt',
    status: '公開中',
    createdAt: '2026-07-01',
  },
  {
    id: 2,
    title: 'Vercel と Neon PostgreSQL の接続',
    category: 'Database',
    status: '公開中',
    createdAt: '2026-07-02',
  },
  {
    id: 3,
    title: '管理画面レイアウトの実装',
    category: 'Frontend',
    status: '下書き',
    createdAt: '2026-07-03',
  },
  {
    id: 4,
    title: '管理画面レイアウトの実装',
    category: 'Frontend',
    status: '下書き',
    createdAt: '2026-07-03',
  },
  {
    id: 5,
    title: '管理画面レイアウトの実装',
    category: 'Frontend',
    status: '下書き',
    createdAt: '2026-07-03',
  },
  {
    id: 6,
    title: '管理画面レイアウトの実装',
    category: 'Frontend',
    status: '下書き',
    createdAt: '2026-07-03',
  },
])
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
  <div class="flex flex-col gap-6 min-h-0 h-full">
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
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
      <UCard>
        <div class="mb-1">全記事</div>
        <div class="text-2xl font-bold">32</div>
      </UCard>
      <UCard>
        <div class="mb-1">公開中</div>
        <div class="text-2xl font-bold">24</div>
      </UCard>
      <UCard>
        <div class="mb-1">下書き</div>
        <div class="text-2xl font-bold">8</div>
      </UCard>
      <UCard>
        <div class="mb-1">カテゴリ数</div>
        <div class="text-2xl font-bold">0</div>
      </UCard>
    </div>
    <!-- table card -->
    <UCard class="flex-1 min-h-0" :ui="{
      body: 'h-full min-h-0 flex flex-col'
    }">
      <div class="flex justify-between min-h-0 items-center mb-4 shrink-0">
        <UInput placeholder="記事を検索..." icon="i-heroicons-magnifying-glass" />
        <div class="flex gap-3">
          <USelect placeholder="カテゴリで絞り込み" :items="['すべて', 'Nuxt', 'Database', 'Frontend']" />
          <USelect placeholder="ステータスで絞り込み" :items="['すべて', '公開中', '下書き']" />
        </div>
      </div>

      <UTable ref="table" :data="posts" :columns="columns" :sticky="true" class="h-full">
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
    </UCard>
  </div>
</template>