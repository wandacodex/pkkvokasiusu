import { Redis } from '@upstash/redis';

// Initialize Redis client strictly using environment variables
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN wajib dikonfigurasi di environment!');
  }
}

export const redis = new Redis({
  url: redisUrl || 'https://placeholder-url.upstash.io',
  token: redisToken || 'placeholder-token',
});

// Redis Keys
export const KEYS = {
  BEASISWA: 'pkk:beasiswa',
  PRESTASI: 'pkk:prestasi',
  SURAT: 'pkk:surat',
  TRACER: 'pkk:tracer',
  KALENDER: 'pkk:kalender',
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

export async function addItems(key, items) {
  if (!items || items.length === 0) return [];
  const list = await getCollection(key);
  const now = new Date().toISOString();
  const newItems = items.map((item, idx) => ({
    ...item,
    id: item.id || `item_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: item.createdAt || now,
    updatedAt: now,
  }));
  const updatedList = [...newItems, ...list];
  await setCollection(key, updatedList);
  return newItems;
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
