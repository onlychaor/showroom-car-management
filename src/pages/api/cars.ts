import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getDb } from '../../lib/mongo'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.MONGODB_URI
  if (mongoUri) {
    const db = await getDb()
    const col = db.collection('cars')
    if (req.method === 'GET') {
      const cars = await col.find({}).toArray()
      return res.status(200).json(cars)
    }
    if (req.method === 'POST') {
      const payload = req.body
      const r = await col.insertOne(payload)
      const doc = await col.findOne({ _id: r.insertedId })
      return res.status(201).json(doc)
    }
    if (req.method === 'PUT') {
      const { id, ...rest } = req.body
      await col.updateOne({ _id: new ObjectId(id) }, { $set: rest })
      const doc = await col.findOne({ _id: new ObjectId(id) })
      return res.status(200).json(doc)
    }
    if (req.method === 'DELETE') {
      const { id } = req.query
      await col.deleteOne({ _id: new ObjectId(String(id)) })
      return res.status(200).json({ deleted: id })
    }
    return res.status(405).end()
  }

  // fallback to supabase
  const supabase = createServerSupabase()
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('cars').select('*')
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json([
        { id: 'car-1', name: 'Ford Transit', color: 'xanh lam', price: '800 triệu' },
        { id: 'car-2', name: 'Honda Civic', color: 'tím', price: '800tr' },
      ])
    }
  }
  if (req.method === 'POST') {
    const payload = req.body
    try {
      const { data, error } = await supabase.from('cars').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    } catch {
      return res.status(201).json([{ id: 'car-new', ...payload }])
    }
  }
  if (req.method === 'PUT') {
    const { id, ...rest } = req.body
    try {
      const { data, error } = await supabase.from('cars').update(rest).eq('id', id).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json([{ id, ...rest }])
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const { data, error } = await supabase.from('cars').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    } catch {
      return res.status(200).json({ deleted: id })
    }
  }
  return res.status(405).end()
}

