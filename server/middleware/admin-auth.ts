export default defineEventHandler(async (event) => {

    const pathName = getRequestURL(event).pathname
    if (pathName.startsWith("/api/admin")) {
        // セッションをチェックします
        await requireUserSession(event)
    }
})