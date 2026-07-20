import { z } from "zod"

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
    console.log("body", body)
    const result = bodySchema.safeParse(body)

    if (!result.success) {
        const errors = z.flattenError(result.error)
        const errorMessageArray = Object.values(errors.fieldErrors).flat()
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                message: errorMessageArray.shift()
            }
        })
    }

    const id = getRouterParam(event, "id")
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            data: {
                message: "記事のIDが指定されていません"
            }
        })
    }
    let existingPost = await prisma.post.findUnique({
        where: { id }
    })
    if (!existingPost) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            data: {
                message: "記事が見つかりません"
            }
        })
    }
    const updatedPost = await prisma.post.update({
        where: { id },
        data: result.data
    })

    return { post: updatedPost }
})