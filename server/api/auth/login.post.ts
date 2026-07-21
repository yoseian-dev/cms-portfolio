import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
    email: z.email('正しいメールアドレスを入力してください'),
    password: z.string().min(1, 'パスワードを入力してください')
})
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = loginSchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "BadRequest",
            data: {
                message: "入力した内容を確認してください",
                errors: z.flattenError(result.error)
            }
        })
    }

    const { email, password } = result.data
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            data: {
                message: "メールアドレスまたはパスワードが正しくありません"
            }
        })
    }

    const passwordMatched = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatched) {
        throw createError({
            statusCode: 400,
            statusMessage: "Unauthorized",
            data: {
                message: "メールアドレスまたはパスワードが正しくありません"
            }
        })
    }

    // success
    const userObject = {
        id: user.id,
        name: user.name,
        email: user.email
    }
    await setUserSession(event, {
        user: userObject
    })

    return { user: userObject }

})