import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('cars').select('*')
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      return res.status(200).json([
        { id: 'car-1', name: 'Ford Transit', color: 'xanh lam', price: '800 triệu' },
        { id: 'car-2', name: 'Honda Civic', color: 'tím', price: '800tr' },
      ])
    }
  }

  if (req.method === 'POST') {
    const payload = req.body
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('cars').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    } catch (err) {
      return res.status(201).json([{ id: 'car-new', ...payload }])
    }
  }

  if (req.method === 'PUT') {
    const { id, ...rest } = req.body
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('cars').update(rest).eq('id', id).select()
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
      const { data, error } = await supabase.from('cars').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      return res.status(200).json({ deleted: id })
    }
  }

  return res.status(405).end()
}

