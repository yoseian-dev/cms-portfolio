<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
<template>
    <div class="flex min-h-screen flex-col bg-default">
        <!-- header -->
        <UHeader to="/" title="Yoseian CMS" :toggle="false">
            <template #right>
                <UButton to="/admin" variant="ghost" size="lg" label="ダッシュボード" aria-label="管理画面へ" />
            </template>
        </UHeader>
        <!-- container -->
        <main class="flex-1 bg-gray-50">
            <slot />
        </main>
        <!-- footer -->
        <UFooter>
            <template #left>
                © {{ currentYear }} Yoseian
            </template>
            <template #right>
                <UButton to="https://github.com/yoseian-dev/cms-portfolio" target="_blank" icon="i-lucide-github"
                    color="neutral" variant="link" aria-label="GitHubでソースコードを見る" />
            </template>
        </UFooter>
    </div>
</template>