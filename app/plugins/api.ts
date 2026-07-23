export default defineNuxtPlugin((nuxtApp) => {
    const { clear } = useUserSession()
    const api = $fetch.create({
        async onResponseError({ request, response }) {
            const unauthorized = response.status === 401
            const isAdminPath = request.toString().startsWith("/api/admin")
            // 管理API、未認証
            if (unauthorized && isAdminPath) {
                await clear()
                await nuxtApp.runWithContext(() => {
                    navigateTo("/login")
                })
            }
        }
    })

    return {
        provide: { api }
    }
})