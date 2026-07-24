import { PostStatus, type Prisma } from '~/generated/prisma/client'

export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  const keyword = (typeof query.keyword === 'string') ? query.keyword.trim() : ''
  const category = (typeof query.category === 'string') ? query.category.trim() : ''
  const requestPage = Number(query.page)
  const page = (Number.isInteger(requestPage) && requestPage > 0) ? requestPage : 1
  const requestSize = Number(query.size)
  // 最大は50件に制限する
  const size = (Number.isInteger(requestSize) && requestSize > 0) ? Math.min(requestSize, 50) : 10

  const where: Prisma.PostWhereInput = {
    status: PostStatus.PUBLISHED,
    ...(keyword && {
      OR: [{
        title: {
          contains: keyword,
          mode: 'insensitive'
        }
      }, {
        excerpt: {
          contains: keyword,
          mode: 'insensitive'
        }
      }]
    }),
    ...(category && {
      category: {
        is: {
          slug: category
        }
      }
    }),
  }

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
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
        }
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
      skip: (page - 1) * size,
      take: size
    }),
    prisma.post.count({ where })
  ])

  return {
    posts,
    pagination: {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    }
  }
})
