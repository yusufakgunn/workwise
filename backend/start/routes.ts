// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Public routes (auth)
router
  .group(() => {
    router.post('auth/register', '#controllers/auth_controller.register')
    router.post('auth/login', '#controllers/auth_controller.login')
  })
  .prefix('/api/v1')

// Protected routes (auth zorunlu)
router
  .group(() => {
    router.get('auth/me', '#controllers/auth_controller.me')
    
    router.resource('projects', '#controllers/projects_controller').apiOnly()
  })
  .prefix('/api/v1')
  .use(middleware.auth())
