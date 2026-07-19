<script setup lang="ts">

import PostForm, { type PostFormData } from '~/components/admin/PostForm.vue';

definePageMeta({
    layout: "admin"
})

const state = reactive<PostFormData>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    status: "DRAFT"
})

const route = useRoute()
const id = route.params.id
const { data: post, status, error } = await useLazyFetch(`/api/admin/posts/${id}`, { server: false })
watch(post, (value) => {
    Object.assign(state, {
        title: value?.title,
        excerpt: value?.excerpt,
        content: value?.content,
        categoryId: value?.categoryId,
        status: value?.status
    })
}, { immediate: true })
const isSubmitting = ref(false)

function onCancel() {
    navigateTo("/admin/posts")
}

function onSubmit() {

}


</script>

<template>
    <div class="flex flex-col p-6 gap-6 overflow-y-auto max-h-full">
        <!-- title -->
        <div class="">
            <h1 class="text-2xl font-bold">記事の編集</h1>
            <p class="text-sm mt-2 text-muted">記事の内容を編集します。</p>
        </div>
        <!-- main -->
        <div class="relative">
            <!-- loading... -->
            <div v-if="status === 'idle' || status === 'pending'" class="absolute inset-0 z-10 flex items-center justify-center
           bg-white/60 backdrop-blur-[1px]">
                <UIcon name="i-lucide-loader-circle" class="animate-spin size-8" />
            </div>
            <PostForm :initial-values="state" :submitting="isSubmitting" submit-label="保存する" @submit="onSubmit"
                @cancel="onCancel" />
        </div>
    </div>
</template>