// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
    // POST /api/v1/auth/register
    public async register({ request }: HttpContext) {
        const data = request.only(['fullName', 'email', 'password'])

        // TODO: validator ekle (email unique vs.) → ileride yaparız
        const user = await User.create(data)

        // Şimdilik user'ı direkt döndürüyoruz (password zaten serialize edilmiyor)
        return user
    }

    // POST /api/v1/auth/login
    public async login({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        try {
            // withAuthFinder'dan geliyor
            const user = await User.verifyCredentials(email, password)

            // DbAccessTokensProvider'dan geliyor
            const token = await User.accessTokens.create(user)

            return {
                user,
                token,
            }
        } catch {
            return response.unauthorized({
                message: 'Geçersiz e-posta veya şifre',
            })
        }
    }

    // İstersek ileride logout da ekleriz (token revoke vs.)
}
