import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://equipped-falcon-217063.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAA0_nAAIgcDI1NzMwZmZiODc3ODI0YWYwYWFjNDRjMTNkNDQ1ODRjOQ',
});

// Redis Keys
export const KEYS = {
  BEASISWA: 'pkk:beasiswa',
  PRESTASI: 'pkk:prestasi',
  SURAT: 'pkk:surat',
  TRACER: 'pkk:tracer',
};

// Generic CRUD helpers
export async function getCollection(key) {
  try {
    const data = await redis.get(key);
    if (!data) return [];
    return Array.isArray(data) ? data : JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${key} from Redis:`, error);
    return [];
  }
}

export async function setCollection(key, data) {
  try {
    await redis.set(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to Redis:`, error);
    throw error;
  }
}

export async function addItem(key, item) {
  const list = await getCollection(key);
  const newItem = {
    ...item,
    id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newItem); // newest first
  await setCollection(key, list);
  return newItem;
}

export async function updateItem(key, id, updateData) {
  const list = await getCollection(key);
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index === -1) {
    throw new Error(`Item with id ${id} not found in ${key}`);
  }
  const updatedItem = {
    ...list[index],
    ...updateData,
    id: list[index].id, // preserve original id
    updatedAt: new Date().toISOString(),
  };
  list[index] = updatedItem;
  await setCollection(key, list);
  return updatedItem;
}

export async function deleteItem(key, id) {
  const list = await getCollection(key);
  const filtered = list.filter((item) => String(item.id) !== String(id));
  await setCollection(key, filtered);
  return { success: true, id };
}

export default redis;
