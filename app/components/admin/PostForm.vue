<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from '@nuxt/ui'
import * as z from "zod"

const schema = z.object({
    title: z.string().min(1, 'タイトルを入力してください'),
    excerpt: z.string().max(200, '概要は200文字以内で入力してください'),
    content: z.string().min(1, '本文を入力してください'),
    categoryId: z.string().min(1, 'カテゴリーを選択してください'),
    status: z.enum(['DRAFT', 'PUBLISHED'])
})

export type PostFormData = z.output<typeof schema>

const props = withDefaults(defineProps<{
    initialValues?: PostFormData,
    submitting?: boolean,
    submitLabel?: string
}>(), {
    initialValues: () => {
        return {
            title: '',
            excerpt: '',
            content: '',
            categoryId: '',
            status: 'DRAFT'
        }
    },
    submitting: false,
    submitLabel: "保存する"
})

const state = reactive<PostFormData>({
    ...props.initialValues
})
watch(() => props.initialValues, (value: PostFormData) => {
    Object.assign(state, value)
}, {
    deep: true,
    immediate: true
})

const categoryItems = ref<{ label: string, value: string }[]>([])
useFetch('/api/admin/categories').then(({
    data: categories,
    status: categoriesStatus,
    error: categoriesError
}) => {
    categoryItems.value = categories.value?.categories?.map(category => ({
        label: category.name,
        value: category.id
    })) ?? []
})

const items = ref<RadioGroupItem[]>([
    {
        label: '下書き',
        value: 'DRAFT',
        description: '下書きとして保存します（公開されません）'
    },
    {
        label: '公開',
        value: 'PUBLISHED',
        description: 'すぐに公開します'
    }
])

const emit = defineEmits<{
    cancel: [],
    submit: [data: PostFormData]
}>()
function onCancel() {
    emit("cancel")
}
function onSubmit(event: FormSubmitEvent<PostFormData>) {
    emit("submit", event.data)
}
</script>

<template>
    <!-- main -->
    <UForm :schema="schema" :state="state" class="flex-1 grid md:grid-cols-3 gap-4" @submit="onSubmit">
        <!-- content -->
        <UCard class="md:col-span-2">
            <div class="space-y-4">
                <UFormField label="タイトル" name="title" required>
                    <UInput v-model="state.title" class="w-full" placeholder="記事タイトルを入力してください" />
                </UFormField>
                <UFormField label="概要" name="excerpt">
                    <UTextarea v-model="state.excerpt" class="w-full" placeholder="記事の概要を入力してください（任意）" />
                </UFormField>
                <UFormField label="本文" name="content" required class="">
                    <UTextarea v-model="state.content" class="w-full h-full" placeholder="記事本文を入力してください" :rows="16" />
                </UFormField>
            </div>
        </UCard>
        <div class="md:col-span-1 space-y-4">
            <UCard title="記事設定">
                <div class="space-y-6">
                    <UFormField label="カテゴリー" name="categoryId">
                        <USelect v-model="state.categoryId" class="w-full" :items="categoryItems" />
                        <template #help>
                            <p>記事のカテゴリーを選択してください。</p>
                        </template>
                    </UFormField>
                    <UFormField label="公開状態" name="status" required>
                        <URadioGroup v-model="state.status" :items="items" />
                    </UFormField>
                </div>
            </UCard>
            <UCard title="アクション">
                <div class="space-y-4">
                    <UButton type="submit" color="primary" block size="xl" icon="i-lucide-save"
                        :loading="props.submitting" :disabled="props.submitting">
                        {{ props.submitLabel }}
                    </UButton>
                    <UButton type="button" color="neutral" variant="outline" block size="xl" @click="onCancel">キャンセル
                    </UButton>
                </div>
            </UCard>
        </div>
    </UForm>
</template>