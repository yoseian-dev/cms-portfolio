<script setup lang="ts">
import { Comark } from "@comark/vue"

defineProps<{
    content: string
}>()
</script>
<template>
    <div class="
        prose prose-neutral dark:prose-invert
        max-w-none
        prose-code:before:content-none
        prose-code:after:content-none
        prose-code:rounded
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:border
        prose-code:border-muted
        prose-code:bg-gray-100
        dark:prose-code:bg-gray-800
        prose-pre:overflow-x-auto
    ">
        <Comark :markdown="content" />
    </div>
</template>