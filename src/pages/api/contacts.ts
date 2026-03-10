import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('contacts').select('*')
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      return res.status(200).json([
        { id: 'ct-1', title: 'Contact A', email: 'contactA@example.com', status: 'Đã hoàn thành' },
        { id: 'ct-2', title: 'Contact B', email: 'contactB@example.com', status: 'Chưa hoàn thành' },
      ])
    }
  }

  if (req.method === 'POST') {
    const payload = req.body
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('contacts').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    } catch (err) {
      return res.status(201).json([{ id: 'ct-new', ...payload }])
    }
  }

  if (req.method === 'PUT') {
    const { id, ...rest } = req.body
    try {
      const supabase = createServerSupabase()
      const { data, error } = await supabase.from('contacts').update(rest).eq('id', id).select()
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
      const { data, error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch (err) {
      return res.status(200).json({ deleted: id })
    }
  }

  return res.status(405).end()
}

