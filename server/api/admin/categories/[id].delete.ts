export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'カテゴリーIDが指定されていません'
            }
        })
    }

    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    posts: true
                }
            }
        }
    })

    if (!category) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            data: {
                message: 'カテゴリーが見つかりません'
            }
        })
    }

    if (category._count.posts > 0) {

        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            data: {
                message: 'このカテゴリーには記事が登録されているため、削除できません'
            }
        })
    }

    await prisma.category.delete({
        where: { id }
    })

    setResponseStatus(event, 204)
})