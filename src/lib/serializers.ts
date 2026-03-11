import { ObjectId } from 'mongodb'

export function serializeDoc(doc: any) {
  if (!doc) return doc
  const out: any = { ...doc }
  if (out._id) {
    out.id = String(out._id)
    delete out._id
  }
  // normalize common FK fields
  if (out.owner_id) {
    out.ownerId = String(out.owner_id)
    delete out.owner_id
  }
  if (out.user_id) {
    out.userId = String(out.user_id)
    delete out.user_id
  }
  if (out.car_id) {
    out.carId = String(out.car_id)
    delete out.car_id
  }
  // convert any ObjectId values to string
  for (const k of Object.keys(out)) {
    if (out[k] instanceof ObjectId) out[k] = String(out[k])
  }
  return out
}

export function serializeArray(arr: any[]) {
  return (arr || []).map(serializeDoc)
}

