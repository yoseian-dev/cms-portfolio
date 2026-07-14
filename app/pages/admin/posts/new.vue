<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from '@nuxt/ui'
import * as z from "zod"
definePageMeta({
    layout: "admin"
})

const schema = z.object({
    title: z.string().min(1, 'タイトルを入力してください'),
    excerpt: z.string().max(200, '概要は200文字以内で入力してください'),
    content: z.string().min(1, '本文を入力してください'),
    categoryId: z.string().min(1, 'カテゴリーを選択してください'),
    status: z.enum(['DRAFT', 'PUBLISHED'])
})

type Schema = z.output<typeof schema>
const state = reactive<Schema>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    status: 'DRAFT'
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

const toast = useToast()
const isSubmitting = ref(false)
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    isSubmitting.value = true
    console.log("....", event.data)
    try {
        await $fetch('/api/admin/posts', {
            method: 'POST',
            body: event.data
        })

        toast.add({
            title: '記事を保存しました',
            color: 'success'
        })

        await navigateTo('/admin/posts')
    } catch (error) {
        toast.add({
            title: '記事の保存に失敗しました',
            description: '時間をおいて、もう一度お試しください',
            color: 'error'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="flex flex-col p-6 gap-6 overflow-y-auto max-h-full">
        <!-- title -->
        <div class="">
            <h1 class="text-2xl font-bold">記事の新規作成</h1>
            <p class="text-sm mt-2 text-muted">新しい記事を作成します。</p>
        </div>
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
                        <UTextarea v-model="state.content" class="w-full h-full" placeholder="記事本文を入力してください"
                            :rows="16" />
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
                        <UButton color="primary" block size="xl" icon="i-lucide-save" type="submit"
                            :loading="isSubmitting" :disabled="isSubmitting">保存する</UButton>
                        <UButton color="neutral" variant="outline" block size="xl" to="/admin/posts">キャンセル</UButton>
                    </div>
                </UCard>
            </div>
        </UForm>
    </div>
</template>