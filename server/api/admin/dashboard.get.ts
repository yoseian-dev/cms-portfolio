import { PostStatus } from '../../../app/generated/prisma/client'
import { prisma } from '../../utils/prisma'
export default defineEventHandler(async () => {
    try {
        const [
            totalPosts,
            publishedPosts,
            draftPosts,
            totalCategories,
            recentPosts
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
            })
        ])

        return {
            stats: {
                totalPosts,
                publishedPosts,
                draftPosts,
                totalCategories
            },
            recentPosts
        }
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'ダッシュボードデータの取得に失敗しました。'
        })
    }
})