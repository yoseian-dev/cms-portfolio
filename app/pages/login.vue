<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import z from 'zod';


useHead({
    title: "ログイン | Yoseian CMS"
})

const loginSchema = z.object({
    email: z.email('正しいメールアドレスを入力してください'),
    password: z.string().min(1, 'パスワードを入力してください')
})

type LoginSchema = z.output<typeof loginSchema>

const form = reactive<LoginSchema>({
    email: "",
    password: ""
})

const { fetch: fetchSession } = useUserSession()
const toast = useToast()
const isLogging = ref(false)
async function onLogin(event: FormSubmitEvent<LoginSchema>) {
    try {
        isLogging.value = true
        await $fetch("/api/auth/login", { method: "POST", body: event.data })
        await fetchSession()
        navigateTo("/admin")
    } catch (error: any) {
        toast.add({
            title: "ログインに失敗しました",
            description: error.data?.data?.message ?? "予期しないエラーが発生しました",
            color: 'error'
        })
    } finally {
        isLogging.value = false
    }
}

</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-muted">
        <UCard class="w-full max-w-md">
            <!-- title -->
            <template #header>
                <div class="text-center">
                    <h1 class="text-2xl font-bold">Yoseian CMS</h1>
                    <p class="text-sm text-muted mt-2">管理画面にログイン</p>
                </div>
            </template>
            <!-- form -->
            <UForm class="space-y-5" :state="form" :schema="loginSchema" @submit="onLogin">
                <UFormField label="メールアドレス" name="email">
                    <UInput v-model="form.email" size="xl" class="w-full" type="email" placeholder="admin@example.com">
                    </UInput>
                </UFormField>
                <UFormField label="パスワード" name="password">
                    <UInput v-model="form.password" size="xl" class="w-full" type="password" placeholder="パスワードを入力">
                    </UInput>
                </UFormField>
                <UButton class="mt-2" type="submit" block size="xl" :loading="isLogging">ログイン</UButton>
            </UForm>
        </UCard>
    </div>
</template>