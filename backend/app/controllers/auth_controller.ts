// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { errors } from '@adonisjs/auth'

export default class AuthController {
    async register({ request, response, auth }: HttpContext) {
        const {
            fullName,
            email,
            password,
            passwordConfirmation,
        } = request.only(['fullName', 'email', 'password', 'passwordConfirmation'])

        if (password !== passwordConfirmation) {
            return response.badRequest({
                error: 'Şifreler eşleşmiyor.',
            })
        }

        try {
            const user = await User.create({
                fullName,
                email,
                password,
            })

            const token = await auth.use('api').createToken(user)

            return {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                token: {
                    type: 'bearer',
                    value: token.value!.release(),
                    expiresAt: token.expiresAt,
                },
            }
        } catch (error: any) {
            // Postgres unique email
            if (error.code === '23505') {
                return response.conflict({
                    error: 'Bu e-posta adresiyle zaten bir hesap bulunuyor.',
                })
            }

            console.error(error)

            return response.internalServerError({
                error: 'Kayıt sırasında beklenmeyen bir hata oluştu.',
            })
        }
    }

    async login({ request, response, auth }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        try {
            // withAuthFinder mixin sayesinde
            const user = await User.verifyCredentials(email, password)

            const token = await auth.use('api').createToken(user)

            return {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                token: {
                    type: 'bearer',
                    value: token.value!.release(),
                    expiresAt: token.expiresAt,
                },
            }
        } catch (error) {
            // Yanlış şifre / email durumunda
            if (error instanceof errors.E_INVALID_CREDENTIALS) {
                return response.unauthorized({
                    error: 'Geçersiz e-posta veya şifre',
                })
            }

            console.error(error)

            return response.internalServerError({
                error: 'Giriş sırasında beklenmeyen bir hata oluştu.',
            })
        }
    }

    async me({ auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.unauthorized({
                error: 'Oturum bulunamadı',
            })
        }

        const user = auth.user!

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        }
    }
}
