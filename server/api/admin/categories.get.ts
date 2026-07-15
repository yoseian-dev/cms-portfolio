export default defineEventHandler(async () => {
    const [categories, total, using, unused] = await Promise.all([
        prisma.category.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        posts: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        }),
        prisma.category.count(),
        prisma.category.count({
            where: {
                posts: {
                    some: {}
                }
            }
        }),
        prisma.category.count({
            where: {
                posts: {
                    none: {}
                }
            }
        })
    ])
    return {
        stats: {
            total,
            using,
            unused
        },
        categories: categories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            postCount: category._count.posts,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }))
    }
})