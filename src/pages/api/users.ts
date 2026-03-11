import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getDb } from '../../lib/mongo'

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

  return res.status(405).json({ error: 'MONGODB_URI not configured or unsupported method' })
}

