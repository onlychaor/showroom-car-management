const { MongoClient } = require('mongodb')

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/showroom'
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  await db.collection('users').deleteMany({})
  await db.collection('cars').deleteMany({})
  await db.collection('contacts').deleteMany({})

  const john = await db.collection('users').insertOne({ name: 'John Carter', email: 'john@example.com', phone: '0123456789', created_at: new Date() })
  const sophie = await db.collection('users').insertOne({ name: 'Sophie Moore', email: 'sophie@example.com', phone: '0987654321', created_at: new Date() })

  const car1 = await db.collection('cars').insertOne({ owner_id: john.insertedId, name: 'Ford Transit', color: 'xanh lam', price: '800 triệu', registration_expires_at: new Date(Date.now() + 10 * 86400000), created_at: new Date() })
  const car2 = await db.collection('cars').insertOne({ owner_id: sophie.insertedId, name: 'Honda Civic', color: 'tím', price: '800tr', registration_expires_at: new Date(Date.now() - 2 * 86400000), created_at: new Date() })

  await db.collection('contacts').insertMany([
    { user_id: john.insertedId, car_id: car1.insertedId, title: 'Contact A', email: 'contactA@example.com', status: 'Đã hoàn thành', scheduled_at: new Date(Date.now() - 3 * 86400000), created_at: new Date(Date.now() - 3 * 86400000) },
    { user_id: sophie.insertedId, car_id: car2.insertedId, title: 'Contact B', email: 'contactB@example.com', status: 'Chưa hoàn thành', scheduled_at: new Date(Date.now() + 2 * 86400000), created_at: new Date() },
  ])

  console.log('Seed completed')
  await client.close()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

