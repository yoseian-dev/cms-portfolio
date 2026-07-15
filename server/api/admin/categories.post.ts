import { z } from 'zod'

const bodySchema = z.object({
    name: z.string().trim().min(1, 'カテゴリー名を入力してください').max(50, 'カテゴリーは50文字以内で入力してください'),
    slug: z.string().trim().min(1, 'スラッグを入力してください').max(50, 'スラッグは50文字以内で入力してください').regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'スラッグは半角英数字とハイフンで入力してください'
    )
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = bodySchema.safeParse(body)
    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: {
                message: z.flattenError(result.error)
            }
        })
    }
    const { name, slug } = result.data

    const existingCategory = await prisma.category.findUnique({
        where: { slug }
    })
    if (existingCategory) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            data: {
                message: 'このスラッグはすでに使用されています'
            }
        })
    }

    const category = await prisma.category.create({
        data: {
            name, slug
        }
    })

    setResponseStatus(event, 201)

    return { category }
})