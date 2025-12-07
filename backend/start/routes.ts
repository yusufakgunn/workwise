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
    // Me
    router.get('auth/me', '#controllers/auth_controller.me')

    // Projects
    router.resource('projects', '#controllers/projects_controller').apiOnly()

    // Tasks (project altında)
    router.get('projects/:projectId/tasks', '#controllers/tasks_controller.index')
    router.post('projects/:projectId/tasks', '#controllers/tasks_controller.store')
  })
  .prefix('/api/v1')
  .use(middleware.auth())
