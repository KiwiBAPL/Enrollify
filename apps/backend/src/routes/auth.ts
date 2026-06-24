import { Router } from 'express'
import type { Container } from '../container.js'
import { verifyAdminPassword } from '../container.js'
import { signAdminToken } from '../middleware/authJwt.js'

export function createAuthRouter(container: Container): Router {
  const router = Router()

  router.post('/login', async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string }

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' })
      return
    }

    if (email !== container.env.ADMIN_EMAIL) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await verifyAdminPassword(container.env, password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = signAdminToken(container.env, email)
    res.json({ token })
  })

  return router
}
