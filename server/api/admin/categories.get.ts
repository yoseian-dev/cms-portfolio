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
                createdAt: true,
                updatedAt: true
            }
        }),
        prisma.category.count(),
        prisma.category.count({
            where: {

            }
        }),
        prisma.category.count()
    ])
    return {
        stats: {
            total,
            using,
            unused
        },
        categories
    }
})