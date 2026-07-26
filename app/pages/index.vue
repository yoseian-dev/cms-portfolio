<script setup lang="ts">

useSeoMeta({
  title: 'Yoseian CMS',
  description: 'Nuxt、TypeScript、Vue.jsについて学んだことを発信しています。',
})

interface PublicPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string
  createdAt: string
  category: {
    name: string
    slug: string
  } | null
}
interface PostResponse {
  posts: PublicPost[]
  pagination: {
    page: number
    size: number
    total: number
    totalPages: number
  }
}

function getCategoryInitial(name?: string) {
  if (!name) {
    return "未"
  }
  return name.trim().charAt(0).toUpperCase()
}

interface PublicCategory {
  id: string
  name: string
  slug: string
  postCount: number
}
interface PublicCategoryResponse {
  total: number
  categories: PublicCategory[]
}
const route = useRoute()
const searchKey = ref(typeof route.query.keyword === 'string' ? route.query.keyword : '')
const selectedCategory = computed(() => typeof route.query.category === 'string' ? route.query.category : '')
const postsQuery = computed(() => ({
  keyword: typeof route.query.keyword === 'string' ? route.query.keyword : '',
  category: selectedCategory.value,
  page: typeof route.query.page === 'string' ? route.query.page : '1',
  size: 5
}))

const { data, status, error } = useFetch<PostResponse>("/api/posts", {
  query: postsQuery,
  default: () => ({
    posts: [],
    pagination: {
      page: 1,
      size: postsQuery.value.size,
      total: 0,
      totalPages: 0
    }
  })
})
const posts = computed(() => data.value?.posts ?? [])

const { data: categoryResponse } = await useLazyFetch<PublicCategoryResponse>("/api/categories", {
  default: () => ({
    total: 0,
    categories: []
  })
})
const categoryItems = computed(() => {
  const schema = categoryResponse.value.categories.map((category: PublicCategory) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    count: category.postCount
  }))
  return [{
    id: "all",
    name: "すべて",
    slug: "",
    count: categoryResponse.value.total
  }, ...schema]
})

watch(
  () => route.query.keyword,
  (keyword) => {
    searchKey.value = typeof keyword === 'string' ? keyword : ''
  },
)

function onSearch() {
  const query = { ...route.query }
  const keyword = searchKey.value.trim()
  if (!keyword) {
    delete query.keyword
  } else {
    query.keyword = keyword
  }
  delete query.page
  navigateTo({ path: "/", query })
}
function onCategoryChange(categorySlug: string) {
  const query = { ...route.query }
  if (categorySlug) {
    query.category = categorySlug
  } else {
    delete query.category
  }
  delete query.page
  navigateTo({ path: "/", query })
}

function onPageChange(page: number) {
  const query = { ...route.query }
  if (page === 1) {
    delete query.page
  } else {
    query.page = String(page)
  }
  navigateTo({ path: "/", query })
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <section class="bg-default">
      <UContainer class="flex flex-col text-center gap-4 py-6">
        <h1 class="text-3xl font-bold text-highlighted">技術と開発の記録</h1>
        <p class="text-muted">Nuxt、TypeScript、Vue.jsについて学んだことを発信しています。</p>
      </UContainer>
    </section>
    <UContainer class="grid grid-cols-1 md:grid-cols-12 gap-3 pb-3">
      <!-- left area -->
      <section class="md:col-span-8">
        <h2 class="text-xl font-bold text-highlighted py-5">最近の記事</h2>
        <div v-if="status === 'pending' && posts.length === 0" class="space-y-3">
          <USkeleton v-for="item in 4" :key="item" class="h-28 w-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <UAlert v-if="error" title="記事を取得できませんでした" color="error" />
        <!-- empty -->
        <div v-else-if="posts.length === 0 && status === 'success'"
          class="rounded-lg border border-dashed border-default py-16 text-center">
          <UIcon name="i-lucide-file-text" class="mb-3 size-8 text-dimmed" />
          <p class="text-muted">公開されている記事はありません。</p>
        </div>
        <!-- list -->
        <div v-else class="space-y-3">
          <article v-for="post in posts" :key="post.id">
            <NuxtLink :to="`/posts/${post.slug}`"
              class="flex items-start gap-3 p-4 bg-default border border-default rounded-md hover:bg-primary/5">
              <UTooltip :text="post.category?.name ?? '未分類'">
                <div
                  class="flex justify-center items-center size-14 text-primary bg-primary/5 border border-primary/10 rounded-sm text-2xl font-bold">
                  {{ getCategoryInitial(post.category?.name) }}
                </div>
              </UTooltip>
              <div class="flex-1 min-w-0 flex flex-col gap-2">
                <h3 class="text-lg font-semibold text-highlighted truncate">{{ post.title }}</h3>
                <p class="text-sm text-muted line-clamp-2">{{ post.excerpt }}</p>
                <div class="flex items-center gap-1 text-sm text-muted">
                  <UIcon name="i-lucide-calendar-days" class="size-4" />
                  <time :datetime="post.publishedAt ?? post.createdAt" class="">{{ formatDate(post.publishedAt ??
                    post.createdAt) }}</time>
                </div>
              </div>
              <UIcon name="i-lucide-arrow-right" class="size-5 shrink-0 text-primary self-center" />
            </NuxtLink>
          </article>
        </div>
        <!-- pagination -->
        <div v-if="data.pagination.total > 0" class="mt-5 flex justify-center">
          <UPagination class="" :page="data.pagination.page" :total="data.pagination.total"
            :items-per-page="data.pagination.size" :sibling-count="1" show-edges @update:page="onPageChange" />
        </div>
      </section>
      <!-- aside area -->
      <aside class="md:col-span-4 py-3 space-y-3" aria-label="記事の絞り込み">
        <section>
          <UCard title="記事検索">
            <form class="flex gap-2" @submit.prevent="onSearch">
              <UInput v-model="searchKey" class="flex-1" icon="i-lucide-search" placeholder="キーワードを入力" />
              <UButton label="検索" type="submit" />
            </form>
          </UCard>
        </section>
        <nav>
          <UCard title="カテゴリー" :ui="{ body: 'flex flex-col gap-2' }">
            <template v-for="schema in categoryItems" :key="schema.id">
              <UButton type="button" class="flex bg-muted hover:bg-primary/5" variant="ghost" color="neutral" size="sm"
                :class="{ 'bg-primary/10': selectedCategory === schema.slug }" @click="onCategoryChange(schema.slug)">
                <span class="min-w-0 flex-1 truncate text-left transition">{{ schema.name }}</span>
                <UBadge :label="schema.count" size="sm" color="neutral" variant="outline" />
                <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0" />
              </UButton>
            </template>
          </UCard>
        </nav>
      </aside>
    </UContainer>
  </div>
</template>