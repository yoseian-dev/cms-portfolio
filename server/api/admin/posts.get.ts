// server/api/admin/posts/index.get.ts
import { PostStatus } from '~/generated/prisma/client'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const keyword =
        typeof query.keyword === 'string'
            ? query.keyword.trim()
            : ''

    const categoryId =
        typeof query.categoryId === 'string'
            ? query.categoryId
            : ''

    const status: PostStatus | undefined =
        query.status === PostStatus.PUBLISHED || query.status === PostStatus.DRAFT
            ? query.status
            : undefined

    const where = {
        ...(keyword
            ? {
                title: {
                    contains: keyword,
                    mode: 'insensitive' as const
                }
            }
            : {}),
        ...(categoryId
            ? {
                categoryId:
                    categoryId === 'uncategorized'
                        ? null
                        : categoryId
            }
            : {}),
        ...(status ? { status } : {})
    }

    const [
        posts,
        total,
        published,
        draft,
        uncategorized,
        categories
    ] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                createdAt: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        }),

        // 统计数据保持为全局数据，不受筛选条件影响
        prisma.post.count(),

        prisma.post.count({
            where: {
                status: PostStatus.PUBLISHED
            }
        }),

        prisma.post.count({
            where: {
                status: PostStatus.DRAFT
            }
        }),

        prisma.post.count({
            where: {
                categoryId: null
            }
        }),

        prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true
            }
        })
    ])

    return {
        stats: {
            total,
            published,
            draft,
            uncategorized
        },
        posts,
        categories
    }
})