// server/api/admin/posts/index.get.ts
export default defineEventHandler(async () => {
    // sleep 2s
    // await new Promise((resolve, reject) => setTimeout(resolve, 2000))

    const [posts, total, published, draft, uncategorized] =
        await Promise.all([
            prisma.post.findMany({
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

            prisma.post.count(),

            prisma.post.count({
                where: {
                    status: 'PUBLISHED'
                }
            }),

            prisma.post.count({
                where: {
                    status: 'DRAFT'
                }
            }),

            prisma.post.count({
                where: {
                    categoryId: null
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
        posts
    }
})