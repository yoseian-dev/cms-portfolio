<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const posts = [
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
]
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
        <UInput placeholder="検索..." icon="i-heroicons-magnifying-glass" />
        <div class="flex gap-3">
          <USelect placeholder="カテゴリで絞り込み" :items="['すべて', 'Nuxt', 'Database', 'Frontend']" />
          <USelect placeholder="カテゴリで絞り込み" :items="['すべて', '公開中', '下書き']" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto min-h-0">
        <table class="w-full text-sm">
          <thead class="border-b text-left text-gray-500">
            <tr>
              <th class="py-3 pr-4 font-medium">
                タイトル
              </th>
              <th class="py-3 pr-4 font-medium">
                カテゴリ
              </th>
              <th class="py-3 pr-4 font-medium">
                ステータス
              </th>
              <th class="py-3 pr-4 font-medium">
                作成日
              </th>
              <th class="py-3 text-right font-medium">
                操作
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="post in posts" :key="post.id" class="border-b last:border-b-0">
              <td class="py-4 pr-4 font-medium">
                {{ post.title }}
              </td>
              <td class="py-4 pr-4">
                {{ post.category }}
              </td>
              <td class="py-4 pr-4">
                <UBadge :color="post.status === '公開中' ? 'primary' : 'neutral'" variant="soft">
                  {{ post.status }}
                </UBadge>
              </td>
              <td class="py-4 pr-4 text-gray-500">
                {{ post.createdAt }}
              </td>
              <td class="py-4 text-right">
                <div class="flex justify-end gap-2">
                  <UButton icon="i-lucide-pencil" variant="ghost" size="sm" />
                  <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>