<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const stats = [
  {
    label: '全記事',
    value: 32,
    description: 'すべての記事',
    icon: 'i-lucide-notebook-tabs',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    iconBgClass: 'bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    label: '公開中',
    value: 24,
    description: '公開されている記事',
    icon: 'i-lucide-send',
    iconClass: 'text-blue-600 dark:text-blue-400',
    iconBgClass: 'bg-blue-50 dark:bg-blue-950/50'
  },
  {
    label: '下書き',
    value: 8,
    description: '下書きの記事',
    icon: 'i-lucide-pencil-line',
    iconClass: 'text-amber-600 dark:text-amber-400',
    iconBgClass: 'bg-amber-50 dark:bg-amber-950/50'
  },
  {
    label: '全カテゴリ',
    value: 4,
    description: '登録済みのカテゴリ',
    icon: 'i-lucide-folder',
    iconClass: 'text-violet-600 dark:text-violet-400',
    iconBgClass: 'bg-violet-50 dark:bg-violet-950/50'
  }
]
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
  }
]
</script>

<template>
  <div class="p-6 flex flex-col min-h-0 gap-6 h-full overflow-y-auto">
    <!-- title -->
    <div class="min-h-0 shrink-0">
      <h1 class="text-2xl font-bold">ダッシュボート</h1>
      <p class="text-muted">CMS全体の状況を確認できます。</p>
    </div>
    <!-- card -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-0 shrink-0">
      <UCard v-for="stat in stats" :key="stat.label" class="@container">
        <div class="flex gap-4">
          <div class="hidden @[240px]:flex size-14 shrink-0 items-center justify-center rounded-full"
            :class="stat.iconBgClass">
            <UIcon :name="stat.icon" class="size-6" :class="stat.iconClass" />
          </div>
          <div>
            <div class="">{{ stat.label }}</div>
            <div class="text-2xl font-bold mb-1">{{ stat.value }}</div>
            <p class="text-sm text-muted">{{ stat.description }}</p>
          </div>
        </div>
      </UCard>
    </div>
    <!-- main -->
    <div class="grid xl:grid-cols-12 gap-6 min-h-90 shrink-0">
      <!-- 記事テーブル -->
      <UCard class="flex flex-col h-full xl:col-span-7" :ui="{ body: 'flex-1', footer: 'p-2' }">
        <div class="">
          <h2 class="text-lg font-bold mb-2">最近の記事</h2>
          <UTable ref="table" :data="posts" :columns="columns" :sticky="true" class="h-full">
            <template #status-cell="{ row }">
              <UBadge :color="row.original.status === '公開中' ? 'success' : 'neutral'" variant="soft">
                {{ row.original.status }}
              </UBadge>
            </template>
          </UTable>
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UButton label="すべての記事を見る" color="primary" variant="link" trailing-icon="i-lucide-arrow-right"
              to="/admin/posts" />
          </div>
        </template>
      </UCard>
      <!-- カテゴリテーブル -->
      <UCard class="flex flex-col h-full xl:col-span-5" :ui="{ body: 'flex-1', footer: 'p-2' }">
        <div class="">
          <h2 class="text-lg font-bold mb-2">カテゴリ別の記事数</h2>
          <div class="flex-1">グラフは今後追加予定です。</div>
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UButton label="すべてのカテゴリを見る" color="primary" variant="link" trailing-icon="i-lucide-arrow-right"
              to="/admin/categories" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>