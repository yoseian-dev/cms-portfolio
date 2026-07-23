<script setup lang="ts">
import PostForm, { type PostFormData } from '~/components/admin/PostForm.vue'
definePageMeta({
    layout: "admin"
})


const state = reactive<PostFormData>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    status: 'DRAFT'
})

const { $api } = useNuxtApp()
const toast = useToast()
const isSubmitting = ref(false)
const onSubmit = async (data: PostFormData) => {
    isSubmitting.value = true
    try {
        await $api('/api/admin/posts', {
            method: 'POST',
            body: data
        })

        toast.add({
            title: '記事を作成しました',
            color: 'success'
        })

        await navigateTo('/admin/posts')
    } catch (error: any) {
        toast.add({
            title: '記事の作成に失敗しました',
            description: error.data?.data?.message ?? '予期しないエラーが発生しました',
            color: 'error'
        })
    } finally {
        isSubmitting.value = false
    }
}

function onCancel() {
    navigateTo("/admin/posts")
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
        <PostForm :initial-values="state" v-model:submitting="isSubmitting" submit-label="保存する" @submit="onSubmit"
            @cancel="onCancel" />
    </div>
</template>