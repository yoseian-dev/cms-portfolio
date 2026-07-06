import { PostStatus } from '../../../app/generated/prisma/client'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        publishedAt: {
          sort: 'desc',
          nulls: 'last',
        },
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  return posts
})
