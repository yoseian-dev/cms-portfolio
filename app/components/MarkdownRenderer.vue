<script setup lang="ts">
import { Comark } from "@comark/vue"

defineProps<{
    content: string
}>()
</script>
<template>
    <article class="prose prose-neutral max-w-none dark:prose-invert">
        <Comark :markdown="content" />
    </article>
</template>