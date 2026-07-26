<script setup lang="ts">
interface CategoryStat {
    id: string
    name: string
    postCount: number
}

const props = defineProps<{
    modelValue?: CategoryStat[]
}>()

const maxCount = computed(() => {
    return Math.max(...props.modelValue?.map(item => item.postCount) ?? [], 1)
})

</script>

<template>
    <div v-if="props.modelValue?.length" class="flex flex-col gap-3">
        <template v-for="item in props.modelValue" :key="item.id">
            <div class="flex gap-3 items-center">
                <span class="w-18 text-muted shrink-0 truncate text-sm">{{ item.name }}</span>
                <span class="flex-1 rounded-full bg-gray-200 dark:bg-gray-700 h-3">
                    <div class="bg-primary rounded-full h-full" :style="{
                        width: `${item.postCount / maxCount * 100}%`
                    }" />
                </span>
                <span class="text-muted">{{ item.postCount }}</span>
            </div>
        </template>
    </div>
    <div v-else>
        カテゴリーがありません。
    </div>
</template>