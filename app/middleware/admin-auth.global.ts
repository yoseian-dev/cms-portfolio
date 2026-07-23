export default defineNuxtRouteMiddleware((to) => {

    if (!to.path.startsWith("/admin")) {
        return;
    }

    // 認証状態を確認します
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
        return navigateTo("/login")
    }
})