<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})

const posts = ref([
  {
    id: 1,
    title: 'Nuxt 4とPrismaでCMSを構築する',
    category: 'Nuxt',
    status: '公開中',
    createdAt: '2026-07-10'
  },
  {
    id: 2,
    title: 'Neon PostgreSQLとの接続方法',
    category: 'Database',
    status: '公開中',
    createdAt: '2026-07-09'
  },
  {
    id: 3,
    title: 'Nuxt UIで管理画面を実装する',
    category: 'Frontend',
    status: '公開中',
    createdAt: '2026-07-08'
  },
  {
    id: 4,
    title: 'Prisma 7の基本的な使い方',
    category: 'Database',
    status: '公開中',
    createdAt: '2026-07-07'
  },
  {
    id: 5,
    title: 'レスポンシブなダッシュボードの作り方',
    category: 'Frontend',
    status: '下書き',
    createdAt: '2026-07-06'
  },
  {
    id: 6,
    title: 'Nuxt Server APIでCRUDを実装する',
    category: 'Backend',
    status: '公開中',
    createdAt: '2026-07-05'
  },
  {
    id: 7,
    title: 'VercelへNuxtアプリをデプロイする',
    category: 'DevOps',
    status: '公開中',
    createdAt: '2026-07-04'
  },
  {
    id: 8,
    title: '管理画面のレイアウト設計',
    category: 'Frontend',
    status: '下書き',
    createdAt: '2026-07-03'
  },
  {
    id: 9,
    title: 'カテゴリ管理機能の設計と実装',
    category: 'Backend',
    status: '下書き',
    createdAt: '2026-07-02'
  },
  {
    id: 10,
    title: 'Tailwind CSSで統一感のあるUIを作る',
    category: 'Frontend',
    status: '公開中',
    createdAt: '2026-07-01'
  },
  {
    id: 11,
    title: 'Prisma Seedで初期データを登録する',
    category: 'Database',
    status: '公開中',
    createdAt: '2026-06-30'
  },
  {
    id: 12,
    title: 'Nuxtプロジェクトのディレクトリ構成',
    category: 'Nuxt',
    status: '下書き',
    createdAt: '2026-06-29'
  }
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