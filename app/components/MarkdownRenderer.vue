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
        prose-code:bg-gray-100
        prose-code:text-gray-800
        dark:prose-code:bg-gray-800
        dark:prose-code:text-gray-100
        prose-li:my-1
        prose-h2:mt-10
        prose-h2:mb-4
        prose-h3:mt-8
        prose-h3:mb-3
        prose-p:leading-8
        prose-p:mb-5
        prose-pre:overflow-x-auto
      ">
        <Comark :markdown="content" />
    </div>
</template>