import { PostStatus } from "~/generated/prisma/client"

export default defineEventHandler(async () => {
    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where: {
                posts: {
                    some: {
                        status: PostStatus.PUBLISHED
                    }
                }
            },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        posts: {
                            where: {
                                status: PostStatus.PUBLISHED
                            }
                        }
                    }
                }
            }
        }),
        prisma.post.count({
            where: {
                status: PostStatus.PUBLISHED
            }
        })
    ])

    return {
        total,
        categories: categories.map(category => {
            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                postCount: category._count.posts
            }
        })
    }
})