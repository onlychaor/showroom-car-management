import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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

