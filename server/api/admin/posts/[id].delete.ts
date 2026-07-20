export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            data: {
                message: "記事IDが指定されていません"
            }
        })
    }

    const existingPost = await prisma.post.findUnique({
        where: { id }
    })

    if (!existingPost) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            data: {
                message: "記事が見つかりません"
            }
        })
    }

    await prisma.post.delete({
        where: { id }
    })

    setResponseStatus(event, 204)
})