<script lang="ts" setup>
definePageMeta({
  layout: 'admin'
})

const columns = [
  {
    accessorKey: 'name',
    header: '名前'
  },
  {
    accessorKey: 'description',
    header: '説明'
  },
  {
    accessorKey: 'postCount',
    header: '記事数'
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
type Category = {
  id: number
  name: string
  description: string
  postCount: number
  createdAt: string
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Nuxt',
    description: 'Nuxt に関する記事',
    postCount: 12,
    createdAt: '2026-07-01'
  },
  {
    id: 2,
    name: 'Database',
    description: 'Prisma や PostgreSQL に関する記事',
    postCount: 8,
    createdAt: '2026-07-02'
  },
  {
    id: 3,
    name: 'Frontend',
    description: 'フロントエンド開発に関する記事',
    postCount: 12,
    createdAt: '2026-07-03'
  },
  {
    id: 4,
    name: 'Backend',
    description: 'バックエンド開発に関する記事',
    postCount: 0,
    createdAt: '2026-07-03'
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
  <div class="flex flex-col gap-6 h-full">
    <!-- title -->
    <div class="flex justify-between items-center min-h-0 shrink-0">
      <div class="">
        <h1 class="text-2xl font-bold">カテゴリ管理</h1>
        <p>カテゴリの作成、編集、削除を行います。</p>
      </div>
      <UButton icon="i-heroicons-plus">新規作成</UButton>
    </div>
    <!-- grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 shrink-0">
      <UCard>
        <div class="mb-1">全カテゴリ</div>
        <div class="text-2xl font-bold">12</div>
      </UCard>
      <UCard>
        <div class="mb-1">使用中</div>
        <div class="text-2xl font-bold">12</div>
      </UCard>
      <UCard>
        <div class="mb-1">未使用</div>
        <div class="text-2xl font-bold">0</div>
      </UCard>
    </div>
    <!-- テーブル -->
    <UCard class="flex flex-col min-h-0 max-h-[calc(100vh-240px)]" :ui="{
      body: 'h-full min-h-0 flex flex-col'
    }">
      <div>
        <UInput placeholder="カテゴリ名で検索..." icon="i-heroicons-magnifying-glass" />
      </div>
      <UTable ref="table" :data="categories" :columns="columns" :sticky="true" class="h-full">
        <template #postCount-cell="{ row }">
          <UBadge :color="row.original.postCount > 0 ? 'success' : 'neutral'" variant="soft">
            {{ row.original.postCount }}
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