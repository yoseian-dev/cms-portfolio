import { PostStatus } from '~/generated/prisma/client'

export default defineEventHandler(async () => {
    try {
        const [
            totalPosts,
            publishedPosts,
            draftPosts,
            totalCategories,
            recentPosts,
            categories
        ] = await Promise.all([
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

            prisma.category.count(),

            prisma.post.findMany({
                take: 5,
                orderBy: {
                    updatedAt: 'desc'
                },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            prisma.category.findMany({
                take: 5,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            posts: true
                        }
                    }
                },
                orderBy: {
                    posts: {
                        _count: 'desc'
                    }
                }
            })
        ])

        return {
            stats: {
                totalPosts,
                publishedPosts,
                draftPosts,
                totalCategories
            },
            recentPosts,
            categoryStats: categories.map((category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                postCount: category._count.posts
            }))
        }
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'ダッシュボードデータの取得に失敗しました。'
        })
    }
})