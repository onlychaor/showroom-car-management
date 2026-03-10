import type { NextApiRequest, NextApiResponse } from 'next'

// Dev-only auth simulator. Do NOT enable in production.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Disabled in production' })
  }

  const { action, email } = req.body || {}

  if (!action || !email) {
    return res.status(400).json({ error: 'Missing action or email' })
  }

  if (action === 'signup') {
    // Simulate user creation and return a fake session
    const user = { id: `dev-${Math.random().toString(36).slice(2, 8)}`, email }
    const session = { access_token: 'dev-token', user }
    return res.status(201).json({ ok: true, message: 'Dev signup successful', session })
  }

  if (action === 'signin') {
    // Simulate sign in if email exists (we accept any)
    const user = { id: `dev-${Math.random().toString(36).slice(2, 8)}`, email }
    const session = { access_token: 'dev-token', user }
    return res.status(200).json({ ok: true, message: 'Dev signin successful', session })
  }

  return res.status(400).json({ error: 'Unknown action' })
}

