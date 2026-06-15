import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const usersCount = await prisma.user.count()
  const postsCount = await prisma.post.count()
  const categoriesCount = await prisma.category.count()

  return {
    status: 'ok',
    database: 'connected',
    counts: {
      users: usersCount,
      posts: postsCount,
      categories: categoriesCount,
    },
  }
})