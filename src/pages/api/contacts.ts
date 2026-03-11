import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getDb } from '../../lib/mongo'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.MONGODB_URI
  if (mongoUri) {
    const db = await getDb()
    const col = db.collection('contacts')
    if (req.method === 'GET') {
    const contacts = await col.find({}).toArray()
    const { serializeArray } = await import('../../lib/serializers')
    return res.status(200).json(serializeArray(contacts))
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

  // fallback to supabase
  const supabase = createServerSupabase()
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('contacts').select('*')
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json([
        { id: 'ct-1', title: 'Contact A', email: 'contactA@example.com', status: 'Đã hoàn thành' },
        { id: 'ct-2', title: 'Contact B', email: 'contactB@example.com', status: 'Chưa hoàn thành' },
      ])
    }
  }
  if (req.method === 'POST') {
    const payload = req.body
    try {
      const { data, error } = await supabase.from('contacts').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    } catch {
      return res.status(201).json([{ id: 'ct-new', ...payload }])
    }
  }
  if (req.method === 'PUT') {
    const { id, ...rest } = req.body
    try {
      const { data, error } = await supabase.from('contacts').update(rest).eq('id', id).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json([{ id, ...rest }])
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const { data, error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json({ deleted: id })
    }
  }
  return res.status(405).end()
}

