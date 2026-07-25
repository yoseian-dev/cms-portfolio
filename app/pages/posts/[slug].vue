<script setup lang="ts">

interface PublicPostDetail {
    id: string
    title: string
    excerpt: string | null
    content: string
    createdAt: string
    publishedAt: string | null
    category: {
        id: string
        name: string
        slug: string
    } | null
}
const route = useRoute()
const { data: post, error } = await useFetch<PublicPostDetail>(() => `/api/posts/${route.params.slug}`)
if (error.value || !post.value) {
    throw createError({
        statusCode: error.value?.statusCode ?? 404,
        statusMessage: '記事が見つかりません',
        fatal: true,
    })
}
useSeoMeta({
    title: () => `${post.value?.title ?? '記事'} | Yoseian CMS`,
    description: () => post.value?.excerpt ?? '',
})

</script>
<template>
    <article v-if="post">
        <header>
            <UContainer class="text-center pt-12">
                <h1 class="text-3xl font-bold text-highlighted">{{ post.title }}</h1>
                <p v-if="post.excerpt" class="text-muted my-3">{{ post.excerpt }}</p>
                <div class="flex justify-center gap-4 text-muted my-5">
                    <template v-if="post.category">
                        <UBadge variant="outline" size="lg">{{ post.category.name }}</UBadge>
                        <span aria-hidden="true">・</span>
                    </template>
                    <div class="flex items-center gap-1 text-sm text-muted">
                        <UIcon name="i-lucide-calendar-days" class="size-4" />
                        <time :datetime="post.publishedAt ?? post.createdAt" class="">
                            {{ formatDate(post.publishedAt ?? post.createdAt) }}
                        </time>
                    </div>
                </div>
            </UContainer>
        </header>
        <UContainer class="max-w-5xl py-8">
            <UCard>
                <div class="whitespace-pre-wrap leading-8 text-default">
                    {{ post.content }}
                </div>
                <template #footer>
                    <UButton icon="i-heroicons-arrow-left-20-solid" label="記事一覧に戻る" to="/" variant="ghost" />
                </template>
            </UCard>
        </UContainer>
    </article>
</template>