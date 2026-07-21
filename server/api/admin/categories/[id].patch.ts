import { z } from "zod"
export default defineEventHandler(async (event) => {
    const bodySchema = z.object({
        name: z.string().trim().min(1, 'カテゴリー名を入力してください').max(50, 'カテゴリーは50文字以内で入力してください'),
        slug: z.string().trim().min(1, 'スラッグを入力してください').max(50, 'スラッグは50文字以内で入力してください').regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'スラッグは半角英数字とハイフンで入力してください'
        )
    })

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: 'カテゴリーIDが指定されていません'
            }
        })
    }

    const body = await readBody(event)
    const result = bodySchema.safeParse(body)
    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: "入力して内容をかくにんしてく",
                errors: z.flattenError(result.error)
            }
        })
    }

    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            data: {
                message: 'カテゴリーが見つかりません'
            }
        })
    }

    const existingSlug = await prisma.category.findFirst({
        where: {
            slug: result.data.slug,
            id: {
                not: id
            }
        }
    })
    if (existingSlug) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            data: {
                message: 'このスラッグはすでに使用されています'
            }
        })
    }

    const updateCategory = await prisma.category.update({
        where: { id },
        data: result.data
    })

    return { category: updateCategory }
})