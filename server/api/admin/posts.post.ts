import { z } from 'zod'
import { prisma } from '../../utils/prisma'

const bodySchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'タイトルを入力してください')
        .max(100, 'タイトルは100文字以内で入力してください'),

    excerpt: z
        .string()
        .trim()
        .max(200, '概要は200文字以内で入力してください'),

    content: z
        .string()
        .trim()
        .min(1, '本文を入力してください'),

    categoryId: z
        .string()
        .min(1, 'カテゴリーを選択してください'),

    status: z.enum(['DRAFT', 'PUBLISHED'])
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = bodySchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: '入力内容に誤りがあります',
            data: z.flattenError(result.error)
        })
    }

    const {
        title,
        excerpt,
        content,
        categoryId,
        status
    } = result.data

    const author = await prisma.user.findFirst({
        select: {
            id: true
        }
    })

    if (!author) {
        throw createError({
            statusCode: 500,
            statusMessage: '投稿者が見つかりません'
        })
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        select: {
            id: true
        }
    })

    if (!category) {
        throw createError({
            statusCode: 400,
            statusMessage: 'カテゴリーが見つかりません'
        })
    }

    const post = await prisma.post.create({
        data: {
            title,
            slug: `post-${crypto.randomUUID()}`,
            excerpt: excerpt || null,
            content,
            status,
            authorId: author.id,
            categoryId: category.id,
            publishedAt: status === 'PUBLISHED'
                ? new Date()
                : null
        },
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            publishedAt: true,
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    setResponseStatus(event, 201)

    return {
        message: '記事を作成しました',
        post
    }
})