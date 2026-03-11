import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabase } from '../../lib/supabaseClient'
import { getDb } from '../../lib/mongo'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (process.env.MONGODB_URI) {
      const db = await getDb()
      const usersCount = await db.collection('users').countDocuments()
      const carsCount = await db.collection('cars').countDocuments()
      const contactsCount = await db.collection('contacts').countDocuments()

      const byStatusAgg = await db
        .collection('contacts')
        .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
        .toArray()
      const byStatus = byStatusAgg.map((r) => ({ status: r._id, count: r.count }))

      const recent = await db
        .collection('contacts')
        .aggregate([
          { $sort: { created_at: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'cars',
              localField: 'car_id',
              foreignField: '_id',
              as: 'car',
            },
          },
          { $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              id: '$_id',
              title: 1,
              status: 1,
              scheduled_at: 1,
              created_at: 1,
              user: { id: '$user._id', name: '$user.name', email: '$user.email' },
              car: { id: '$car._id', name: '$car.name' },
            },
          },
        ])
        .toArray()

      return res.status(200).json({
        totals: { users: usersCount, cars: carsCount, contacts: contactsCount },
        byStatus,
        recent,
      })
    }

    const supabase = createServerSupabase()

    // total counts
    const [{ count: usersCount }, { count: carsCount }, { count: contactsCount }] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('cars').select('id', { count: 'exact' }),
      supabase.from('contacts').select('id', { count: 'exact' }),
    ])

    // contacts by status
    const { data: byStatus } = await supabase.from('contacts').select('status, count:id').group('status')

    // recent contacts with joins
    const { data: recent } = await supabase
      .from('contacts')
      .select(`
        id,
        title,
        status,
        scheduled_at,
        created_at,
        user:users(id, name, email),
        car:cars(id, name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    return res.status(200).json({
      totals: { users: usersCount || 0, cars: carsCount || 0, contacts: contactsCount || 0 },
      byStatus: byStatus || [],
      recent: recent || [],
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
}

