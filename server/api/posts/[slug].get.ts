import { PostStatus } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug")
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                message: "記事のスラッグが指定されていません"
            }
        })
    }

    const post = prisma.post.findUnique({
        where: { slug, status: PostStatus.PUBLISHED },
        select: {
            id: true,
            title: true,
            excerpt: true,
            content: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            status: true,
            createdAt: true,
            publishedAt: true
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