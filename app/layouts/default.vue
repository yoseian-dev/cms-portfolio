<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
<template>
    <div class="flex min-h-screen flex-col bg-default">
        <!-- header -->
        <header class="border-b border-default">
            <UContainer class="flex h-16 items-center justify-between">
                <NuxtLink class="text-xl font-bold text-highlighted" to="/">Yoseian CMS</NuxtLink>
                <UButton to="/admin" variant="ghost" size="lg" label="ダッシュボード" aria-label="管理画面へ" />
            </UContainer>
        </header>
        <!-- container -->
        <main class="flex-1">
            <slot />
        </main>
        <!-- footer -->
        <footer class="border-t border-default">
            <UContainer class="flex h-16 items-center justify-between">
                <p class="text-sm text-muted">© {{ currentYear }} Yoseian</p>
                <UButton to="https://github.com/yoseian-dev/cms-portfolio" target="_blank" icon="i-lucide-github"
                    color="neutral" variant="link" aria-label="GitHubでソースコードを見る" />
            </UContainer>
        </footer>
    </div>
</template>