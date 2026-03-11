import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getDb } from '../../lib/mongo'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.MONGODB_URI
  if (mongoUri) {
    const db = await getDb()
    const col = db.collection('users')
    if (req.method === 'GET') {
    const users = await col.find({}).toArray()
    const { serializeArray } = await import('../../lib/serializers')
    return res.status(200).json(serializeArray(users))
    }
    if (req.method === 'POST') {
      const payload = req.body
    const r = await col.insertOne(payload)
    const doc = await col.findOne({ _id: r.insertedId })
    const { serializeDoc } = await import('../../lib/serializers')
    return res.status(201).json(serializeDoc(doc))
    }
    if (req.method === 'PUT') {
      const { id, ...rest } = req.body
      await col.updateOne({ _id: new ObjectId(id) }, { $set: rest })
      const doc = await col.findOne({ _id: new ObjectId(id) })
      const { serializeDoc } = await import('../../lib/serializers')
      return res.status(200).json(serializeDoc(doc))
    }
    if (req.method === 'DELETE') {
      const { id } = req.query
      await col.deleteOne({ _id: new ObjectId(String(id)) })
      return res.status(200).json({ deleted: String(id) })
    }
    return res.status(405).end()
  }

  // fallback to supabase if no mongo
  const supabase = createServerSupabase()
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('users').select('*')
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json([
        { id: 'local-1', name: 'John Carter', email: 'john@example.com', phone: '0123456789' },
        { id: 'local-2', name: 'Sophie Moore', email: 'sophie@example.com', phone: '0987654321' },
      ])
    }
  }
  if (req.method === 'POST') {
    const payload = req.body
    try {
      const { data, error } = await supabase.from('users').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    } catch {
      return res.status(201).json([{ id: 'local-new', ...payload }])
    }
  }
  if (req.method === 'PUT') {
    const { id, ...rest } = req.body
    try {
      const { data, error } = await supabase.from('users').update(rest).eq('id', id).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json([{ id, ...rest }])
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const { data, error } = await supabase.from('users').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json({ deleted: id })
    }
  }

  return res.status(405).end()
}

