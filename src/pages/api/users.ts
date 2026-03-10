import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('users').select('*')
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      // Dev fallback sample data
      return res.status(200).json([
        { id: 'local-1', name: 'John Carter', email: 'john@example.com', phone: '0123456789' },
        { id: 'local-2', name: 'Sophie Moore', email: 'sophie@example.com', phone: '0987654321' },
      ])
    }
  }

  if (req.method === 'POST') {
    const payload = req.body
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('users').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    } catch (err) {
      // Dev fallback - echo created
      return res.status(201).json([{ id: 'local-new', ...payload }])
    }
  }

  if (req.method === 'PUT') {
    const { id, ...rest } = req.body
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('users').update(rest).eq('id', id).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      return res.status(200).json([{ id, ...rest }])
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('users').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      return res.status(200).json({ deleted: id })
    }
  }

  return res.status(405).end()
}

