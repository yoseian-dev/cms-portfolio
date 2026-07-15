<script lang="ts" setup>
definePageMeta({
  layout: 'admin'
})

const columns = [
  { accessorKey: 'name', header: '名前' },
  { accessorKey: 'slug', header: '説明' },
  { accessorKey: 'postCount', header: '記事数' },
  { accessorKey: 'createdAt', header: '作成日' },
  { id: 'actions', header: '操作' }
]

const { data, status, error } = useLazyFetch('/api/admin/categories', {
  server: false
})

const categories = computed(() => data.value?.categories)

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
      <UButton icon="i-heroicons-plus">新規作成</UButton>
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