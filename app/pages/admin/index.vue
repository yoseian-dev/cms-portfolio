<script setup lang="ts">
import DashboardSkeleton from '~/components/admin/DashboardSkeleton.vue';

definePageMeta({
  layout: 'admin'
})

const { data, status, error } = await useLazyFetch('/api/admin/dashboard', { server: false })

const stats = computed(() => [
  {
    label: '全記事',
    value: data.value?.stats.totalPosts || 0,
    description: 'すべての記事',
    icon: 'i-lucide-notebook-tabs',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    iconBgClass: 'bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    label: '公開中',
    value: data.value?.stats.publishedPosts || 0,
    description: '公開されている記事',
    icon: 'i-lucide-send',
    iconClass: 'text-blue-600 dark:text-blue-400',
    iconBgClass: 'bg-blue-50 dark:bg-blue-950/50'
  },
  {
    label: '下書き',
    value: data.value?.stats.draftPosts || 0,
    description: '下書きの記事',
    icon: 'i-lucide-pencil-line',
    iconClass: 'text-amber-600 dark:text-amber-400',
    iconBgClass: 'bg-amber-50 dark:bg-amber-950/50'
  },
  {
    label: '全カテゴリー',
    value: data.value?.stats.totalCategories || 0,
    description: '登録済みのカテゴリー',
    icon: 'i-lucide-folder',
    iconClass: 'text-violet-600 dark:text-violet-400',
    iconBgClass: 'bg-violet-50 dark:bg-violet-950/50'
  }
]);


const recentPosts = computed(() => data.value?.recentPosts ?? [])

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
    header: '更新日'
  }
]

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ja-JP').format(new Date(date))
}
</script>

<template>
  <DashboardSkeleton v-if="status === 'idle' || status === 'pending'" class="p-6" />
  <div v-else class="p-6 flex flex-col min-h-0 gap-6 h-full overflow-y-auto">
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
          <UTable ref="table" :data="recentPosts" :columns="columns" :sticky="true" class="h-full">
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
          </UTable>
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UButton label="すべての記事を見る" color="primary" variant="link" trailing-icon="i-lucide-arrow-right"
              to="/admin/posts" />
          </div>
        </template>
      </UCard>
      <!-- カテゴリーテーブル -->
      <UCard class="flex flex-col h-full xl:col-span-5" :ui="{ body: 'flex-1', footer: 'p-2' }">
        <div class="h-full">
          <h2 class="text-lg font-bold mb-2">カテゴリー別の記事数</h2>
          <div class="flex-1 text-muted mt-2 text-sm h-full flex justify-center items-center">グラフは今後追加予定です。</div>
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UButton label="すべてのカテゴリーを見る" color="primary" variant="link" trailing-icon="i-lucide-arrow-right"
              to="/admin/categories" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>