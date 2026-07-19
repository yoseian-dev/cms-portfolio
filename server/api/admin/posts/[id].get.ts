export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                message: "記事のIDが指定されていません"
            }
        })
    }

    const post = prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            excerpt: true,
            content: true,
            createdAt: true,
            categoryId: true,
            status: true
        }
    })

    if (!post) {
        throw createError({
            status: 404,
            statusMessage: "Not Found",
            data: {
                message: "記事が見つかりません"
            }
        })
    }

    return post
})