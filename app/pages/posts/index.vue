<script setup lang="ts">
const { data: posts, pending, error } = await useFetch('/api/posts', {
  default: () => [],
})
</script>

<template>
  <UContainer class="py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">
        Posts
      </h1>
      <p class="mt-2 text-gray-500">
        Published posts from the CMS.
      </p>
    </div>

    <div v-if="pending">
      Loading...
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      title="Failed to load posts"
    />

    <div
      v-else
      class="grid gap-4"
    >
      <UCard
        v-for="post in posts"
        :key="post.id"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">
              {{ post.title }}
            </h2>
            <UBadge
              v-if="post.category"
              color="primary"
              variant="soft"
            >
              {{ post.category.name }}
            </UBadge>
          </div>
        </template>

        <p class="line-clamp-2 text-gray-600">
          {{ post.excerpt }}
        </p>

        <template #footer>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>
              Author: {{ post.author?.name || 'Unknown' }}
            </span>

            <NuxtLink
              :to="`/posts/${post.slug}`"
              class="text-primary hover:underline"
            >
              Read more
            </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
